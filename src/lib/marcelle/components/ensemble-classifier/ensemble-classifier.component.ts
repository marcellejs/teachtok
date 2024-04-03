import type {
  Dataset,
  TFJSCustomClassifier,
  TFJSCustomClassifierOptions,
  ClassifierResults,
  MLPClassifier,
  DataStore,
  ObjectId,
  StoredModel,
} from '@marcellejs/core';
import { Model, iterableFromArray, mlpClassifier, Stream } from '@marcellejs/core';
import seedrandom from 'seedrandom';
import type { ImageInstance } from '$lib/marcelle/datasets';

export interface EnsembleClassifierOptions extends TFJSCustomClassifierOptions {
  k: number;
  units: number[];
}

function arrayAverage(arr: number[]): number {
  return arr.reduce((x, y) => x + y) / arr.length;
}

function likeliest(confidences: Record<string, number>): string {
  let label = '';
  let crtMax = 0;
  for (const [key, val] of Object.entries(confidences)) {
    if (val > crtMax) {
      label = key;
      crtMax = val;
    }
  }
  return label;
}

function shuffleArray<T>(a: T[]): T[] {
  const b = a.slice();
  const rng = seedrandom('marcelle!');
  for (let i = b.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * i);
    const temp = b[i];
    b[i] = b[j];
    b[j] = temp;
  }
  return b;
}

export class EnsembleClassifier extends Model<ImageInstance, ClassifierResults> {
  title = 'EnsembleClassifier';
  k: number;
  ready = false;

  serviceName = 'ensemble-models';

  parameters: {
    units: Stream<number[]>;
  } & TFJSCustomClassifier['parameters'];

  models: MLPClassifier[] = [];

  constructor({
    k = 3,
    units = [64, 32],
    epochs = 20,
    batchSize = 8,
  }: Partial<EnsembleClassifierOptions> = {}) {
    super();
    this.k = k;
    this.parameters = {
      units: new Stream(units, true),
      epochs: new Stream(epochs, true),
      batchSize: new Stream(batchSize, true),
    };
  }

  async train(dataset: Dataset<ImageInstance>, metaCVBatch: any): Promise<void> {
    this.ready = false;
    this.$training.set({ status: 'start', epochs: this.parameters.epochs.get() });
    this.models = Array.from(Array(this.k), () =>
      mlpClassifier({
        layers: this.parameters.units.get(),
        epochs: this.parameters.epochs.get(),
        batchSize: this.parameters.batchSize.get(),
      }),
    );

    const allInstances = await dataset
      .items()
      .query({ $sort: { createdAt: -1 } })
      .select(['id', '_id', 'x', 'y'])
      .toArray()
      .then(shuffleArray);
    const n = allInstances.length;
    const foldSize = Math.floor(n / this.k);
    const batchedData = Array.from(Array(this.k), (_, i) =>
      allInstances.slice(i * foldSize, Math.min((i + 1) * foldSize, allInstances.length)),
    );
    const epochs = this.parameters.epochs.get();
    this.$training.set({ status: 'start', epochs: epochs * this.k });
    metaCVBatch.clear();
    metaCVBatch.$status.set({ status: 'start' });
    // eslint-disable-next-line no-param-reassign
    metaCVBatch.total = n;
    for await (const i of Array.from(Array(this.k), (_, j) => j)) {
      const trainData = batchedData.filter((_, k) => i !== k).flat();
      const testData = batchedData.filter((_, k) => i === k).flat();

      try {
        await this.trainFold(trainData, i);
        await metaCVBatch.testFold(this.models[i], testData);
        this.models[i].$training.set({ status: 'idle' });
      } catch (error) {
        this.$training.set({ status: 'error' });
        return;
      }
    }
    this.$training.set({ status: 'success' });
    metaCVBatch.$status.set({ status: 'success' });
    this.ready = true;
  }

  async trainFold(trainData: ImageInstance[], i: number) {
    return new Promise<void>((resolve, reject) => {
      this.models[i].train(iterableFromArray(trainData));
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      let unSub = () => {};
      unSub = this.models[i].$training.subscribe(({ status, epoch, epochs, data }) => {
        if (status === 'error') {
          unSub();
          this.$training.set({ status, data });
          reject();
        } else if (status === 'epoch') {
          const e = epochs || 1;
          this.$training.set({
            status: 'epoch',
            epoch: e * i + (epoch || 0),
            epochs: e * this.k,
          });
        } else if (status === 'success') {
          unSub();
          resolve();
        }
      });
    });
  }

  async predict(x: ImageInstance['x']): Promise<ClassifierResults> {
    if (!this.models) return { label: '', confidences: {} };

    const preds = await Promise.all(this.models.map((m) => m.predict(x)));
    const allConfidences: Record<string, number[]> = {};
    for (const pred of preds) {
      for (const [label, conf] of Object.entries(pred.confidences)) {
        allConfidences[label] = (allConfidences[label] || []).concat([conf]);
      }
    }

    const confidences = Object.entries(allConfidences)
      .map(([key, val]) => [key, arrayAverage(val)])
      .reduce((o, [key, val]) => ({ ...o, [key]: val }), {});

    return { label: likeliest(confidences), confidences };
  }

  async save(
    store: DataStore,
    name: string,
    metadata?: Record<string, unknown>,
    id: ObjectId | null = null,
  ): Promise<ObjectId | null> {
    if (!this.models) return null;
    const ids = await Promise.all(
      this.models.map((m, i) => m.save(store, `${name}-${i}`, metadata)),
    );

    const storedModel: StoredModel = {
      name,
      files: ids.map((x, i) => [`${name}-${i}`, x]),
      format: 'teachtok-ensemble',
    };
    return this.saveToDatastore(store, storedModel, id as ObjectId);
  }

  async load(store: DataStore, idOrName: ObjectId | string): Promise<StoredModel> {
    if (!idOrName) return null;
    this.$training.set({
      status: 'loading',
    });
    this.ready = false;
    try {
      const storedModel = await this.loadFromDatastore(store, idOrName);
      this.k = storedModel.files.length;
      this.models = Array.from(Array(this.k), () => mlpClassifier());
      for (const [i, [name, id]] of storedModel.files.entries()) {
        console.log('ensemble.load', i, name, id);
        await this.models[i].load(store, id);
      }

      this.$training.set({
        status: 'loaded',
        data: {
          source: 'datastore',
          url: store.location,
        },
      });
      return storedModel;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log('[tfjs-model] Loading error', error);
      this.$training.set({
        status: 'error',
      });
      throw error;
    }
  }

  download(): never {
    throw new Error('EnsembleClassifier does not support downloading');
  }

  upload(): never {
    throw new Error('EnsembleClassifier does not support uploading');
  }
}
