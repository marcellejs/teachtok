import { type BatchPrediction, confidencePlot, imageDisplay } from '@marcellejs/core';
import { confusionMatrix, dataset, datasetBrowser } from '@marcellejs/core';
import { cvBatch, metaCVBatch } from './cross-validation';
import type { ImageInstance } from './datasets';
import { logEvent } from './log';
import { store } from './store';

export const cvConfusion = confusionMatrix(metaCVBatch as unknown as BatchPrediction);
export const $accuracy = cvConfusion.$accuracy.map((x) => Math.floor(1000 * x) / 10).hold();

const $confMatFilter = cvConfusion.$selected
  .filter((x) => !!x)
  .map(({ x: label, y: yTrue }) =>
    cvBatch.items().query({ label, yTrue }).select(['instanceId']).toArray(),
  )
  .awaitPromises()
  .map((preds) => preds.map(({ instanceId }) => instanceId))
  .merge(cvConfusion.$selected.filter((x) => !x).map(() => []))
  .map((ids) => ({ id: { $in: ids } }));

const confMatDataset = dataset<ImageInstance>('training-set', store);
confMatDataset.sift({ id: { $in: [] } });
export const confMatDatasetBrowser = datasetBrowser(confMatDataset);
confMatDatasetBrowser.title = 'Inspect Errors';

export const confSelection = cvConfusion.$selected
  .map((z) => z || { y: '', x: '' })
  .startWith({ y: '', x: '' })
  .hold();

$confMatFilter.subscribe(confMatDataset.sift);
cvConfusion.$selected.subscribe((x) => {
  logEvent('inspect-confusion', x);
});

// confMatDatasetBrowser.$selected.subscribe(console.log);
const $confmatPredictions = confMatDatasetBrowser.$selected
  .filter((x) => x.length === 1)
  .map(([id]) => confMatDataset.get(id, ['x', 'raw_image']))
  .awaitPromises()
  .map((instance) =>
    cvBatch
      .items()
      .query({ instanceId: instance.id })
      .toArray()
      .then(([prediction]) => ({ instance, prediction })),
  )
  .awaitPromises();

$confmatPredictions
  .map(({ prediction }) => prediction)
  .subscribe((x) => {
    logEvent('inspect-prediction', x);
  });

export const confmatHasSelection = confMatDatasetBrowser.$selected
  .map((x) => x.length === 1)
  .skipRepeats();

export const confmatImage = imageDisplay(
  $confmatPredictions.map(({ instance }) => instance.raw_image),
);

export const confmatConfidences = confidencePlot(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  $confmatPredictions.map(({ prediction }) => prediction) as any,
);
confmatConfidences.title = 'Confidences for selected instance (Cross-validation)';
