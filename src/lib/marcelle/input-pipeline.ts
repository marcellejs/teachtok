import {
  button,
  webcam,
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

export const inputMobile = webcam();
inputMobile.$images.subscribe(() => {
  logEvent('upload');
});

export const input = imageUpload({ width: 224, height: 224 });
input.$images.subscribe(() => {
  logEvent('upload');
});

const featureExtractor = mobileNet();

const $images = new Stream(input.$images, true);
export const inputDisplay = imageDisplay($images);

const $imagesMobile = new Stream(inputMobile.$images, true);

export const src = imageUpload({ width: 224, height: 224})
export const displayMobile = imageDisplay(src.$images);

export const label = textInput();
label.title = 'Instance label';

export const capture = button('Record Instance');
capture.title = 'Capture image to my dataset';

export const captureMobile = button('Record Mobile Instance');
captureMobile.title = 'this is not showed anyway';

const $myPredictions = $images
  .merge(metaCVModel.$training.filter(({ status }) => status === 'success').sample($images))
  .filter(() => metaCVModel.ready)
  .map(async (img) => metaCVModel.predict(await featureExtractor.process(img)))
  .awaitPromises();
$myPredictions.subscribe((pred) => {
  logEvent('prediction', pred);
});

const $predictionsMobile = $imagesMobile
  .merge(metaCVModel.$training.filter(({ status }) => status === 'success').sample($imagesMobile))
  .filter(() => metaCVModel.ready)
  .map(async (img) => metaCVModel.predict(await featureExtractor.process(img)))
  .awaitPromises();
$predictionsMobile.subscribe((pred) => {
  logEvent('prediction', pred);
});

export const myConfidences = confidencePlot($myPredictions);
myConfidences.title = 'Predictions (My Model)';

export const confidencesMobile = confidencePlot($predictionsMobile);
confidencesMobile.title = 'Predictions (My Model)';

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

  captureMobile.$click
  .sample(src.$images.zip((t, i) => [i, t], src.$thumbnails))
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
