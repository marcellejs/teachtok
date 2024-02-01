import type {
  Dataset,
  TFJSCustomClassifier,
  TFJSCustomClassifierOptions,
  ClassifierResults,
  MLPClassifier,
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
  let label: string;
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

  serviceName = 'tfjs-models';

  parameters: {
    units: Stream<number[]>;
  } & TFJSCustomClassifier['parameters'];

  models: MLPClassifier[];

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
      ...this.parameters,
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

  async trainFold(trainData, i) {
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
          this.$training.set({
            status: 'epoch',
            epoch: epochs * i + epoch,
            epochs: epochs * this.k,
          });
        } else if (status === 'success') {
          unSub();
          resolve();
        }
      });
    });
  }

  async predict(x: ImageInstance['x']): Promise<ClassifierResults> {
    if (!this.models) return null;

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

  save(): never {
    throw new Error('MobileNet does not support saving');
  }

  load(): never {
    throw new Error('MobileNet does not support loading');
  }

  download(): never {
    throw new Error('MobileNet does not support downloading');
  }

  upload(): never {
    throw new Error('MobileNet does not support uploading');
  }
}
