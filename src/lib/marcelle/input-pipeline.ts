import {
  button,
  confidencePlot,
  imageDisplay,
  imageUpload,
  mobileNet,
  notification,
  Stream,
  textInput,
} from '@marcellejs/core';
import { crossValidation, metaCVModel } from './cross-validation';
import { myTrainingData } from './datasets';
import { logEvent } from './log';
import { store, type User } from './store';

export const input = imageUpload({ width: 224, height: 224 });
input.$images.subscribe(() => {
  logEvent('upload');
});
const featureExtractor = mobileNet();

const $images = new Stream(input.$images, true);
export const inputDisplay = imageDisplay($images);

export const label = textInput();
label.title = 'Instance label';
export const capture = button('Record Instance');
capture.title = 'Capture image to my dataset';

const $myPredictions = $images
  .merge(metaCVModel.$training.filter(({ status }) => status === 'success').sample($images))
  .filter(() => metaCVModel.ready)
  .map(async (img) => metaCVModel.predict(await featureExtractor.process(img)))
  .awaitPromises();
$myPredictions.subscribe((pred) => {
  logEvent('prediction', pred);
});

export const myConfidences = confidencePlot($myPredictions);
myConfidences.title = 'Predictions (My Model)';

capture.$click
  .sample($images.zip((t, i) => [i, t], input.$thumbnails))
  .map(async ([img, thumbnail]) => ({
    x: await featureExtractor.process(img),
    y: label.$value.value,
    raw_image: img,
    thumbnail,
    team: (store.user as User).team,
    public: false,
  }))
  .awaitPromises()
  .map(myTrainingData.create)
  .awaitPromises()
  .tap(crossValidation)
  .subscribe(() => {
    notification({
      title: 'New data',
      message: `Your image was recorded to your data`,
    });
  });
