import type { BatchPrediction, MLPClassifier } from '@marcellejs/core';
import { Stream, iterableFromArray, batchPrediction } from '@marcellejs/core';
import { store } from './store';
import { ensembleClassifier } from './components';
import { allTrainingData, type ImageInstance } from './datasets';

const nFolds = 3;
export const metaCVModel = ensembleClassifier({ k: nFolds });

export const cvBatch = batchPrediction('cv', store);

export const metaCVBatch = {
  total: 0,
  count: 0,
  $status: new Stream({ status: 'idle' }, true) as BatchPrediction['$status'],
  predictionService: cvBatch.predictionService,
  testFold(model: MLPClassifier, testData: ImageInstance[]): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      cvBatch.predict(model, iterableFromArray(testData));
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      let unSub = () => {};
      unSub = cvBatch.$status.subscribe(({ status, data }) => {
        if (status === 'error') {
          this.$status.set({ status: 'error' });
          unSub();
          reject();
        } else if (status === 'running') {
          this.$status.set({
            status: 'running',
            count: ++this.count,
            total: this.total,
            data,
          });
        } else if (status === 'success') {
          cvBatch.$status.set({ status: 'idle' });
          unSub();
          resolve();
        }
      });
    });
  },
  clear() {
    cvBatch.clear();
    this.total = 0;
    this.count = 0;
    this.$status.set('idle');
  },
};

export const trainingUpToDate = new Stream(false, true);

metaCVModel.$training.subscribe(({ status }) => {
  if (status === 'success') {
    trainingUpToDate.set(true);
  }
});

cvBatch.$status.subscribe(({ status }) => {
  if (status === 'loading') {
    metaCVBatch.$status.set({ status });
  } else if (status === 'loaded') {
    metaCVBatch.predictionService = cvBatch.predictionService;
    metaCVBatch.$status.set({ status });
  }
});

export function crossValidation() {
  metaCVModel.train(allTrainingData, metaCVBatch);
}
