import {
  dataset,
  datasetBrowser,
  type Instance,
  select,
  Stream,
  notification,
} from '@marcellejs/core';
import { trainingUpToDate } from './cross-validation';
import { store, type User } from './store';

export interface ImageInstance extends Instance {
  x: number[];
  y: string;
}

export const allTrainingData = dataset<ImageInstance>('training-set', store);
allTrainingData.sift({ team: 'none' });
store.connect().then(() => {
  allTrainingData.sift({ team: (store.user as User).team });
});
export const allTrainingDataBrowser = datasetBrowser(allTrainingData);

allTrainingData.$changes.subscribe(() => {
  trainingUpToDate.set(false);
});

export const $currentClasses = new Stream<string[]>([], true);
allTrainingData.$changes
  .filter((x) => x.length > 0)
  .map(() => allTrainingData.distinct('y'))
  .awaitPromises()
  .subscribe((x) => {
    $currentClasses.set(x);
  });

export const $numClasses = new Stream(
  $currentClasses.map((x) => x.length),
  true,
);
$numClasses.start();

export const myTrainingData = dataset<ImageInstance>('training-set', store);
myTrainingData.sift({ public: false });
export const myTrainingDataBrowser = datasetBrowser(myTrainingData, { batchSize: 0 });
myTrainingDataBrowser.title = 'My Dataset';

export const collectiveTrainingData = dataset<ImageInstance>('training-set', store);
collectiveTrainingData.sift({ team: 'none', public: true });
store.connect().then(() => {
  collectiveTrainingData.sift({ team: (store.user as User).team, public: true });
});
export const collectiveTrainingDataBrowser = datasetBrowser(collectiveTrainingData);
collectiveTrainingDataBrowser.title = 'Shared Dataset';

export const selectClass = select(['all']);
$currentClasses.subscribe((c) => selectClass.$options.set(['all', ...c]));

selectClass.title = 'Choose a Class:';
selectClass.$value.subscribe((label) => {
  const newQuery = label === 'all' ? { public: true } : { public: true, y: label };
  if (JSON.stringify(newQuery) === JSON.stringify(collectiveTrainingData.query)) return;
  collectiveTrainingData.sift(newQuery);
});

export interface Comment extends Instance {
  x: undefined;
  y: undefined;
  action: 'chat' | 'insight' | 'dataset';
  comment: string;
  instances: string[];
  label: string;
  author: string;
  public: boolean;
}
export const comments = dataset<Comment>('comments', store);
comments.sift({ team: 'none' });
store.connect().then(() => {
  comments.sift({ team: (store.user as User).team });
});

comments.$changes.subscribe((changes) => {
  for (const { level, type, data } of changes) {
    if (level === 'instance' && type === 'created' && data.userId !== (store.user as User)._id) {
      if (data.action === 'dataset') {
        notification({
          title: 'Someone shared new data!',
          message: `${data.author} added ${data.instances.length} new images to the dataset. To take these changes into account, re-train the model`,
          duration: 0,
        });
      } else {
        notification({
          title: `New message from ${data.author}`,
          message: data.action.includes('data') ? 'Added data' : data.comment,
        });
      }
    }
  }
});

export const newMessages = new Stream(0, true);
comments.ready
  .then(() =>
    localStorage.getItem('lastChatViewed')
      ? {
          createdAt: {
            $gte: localStorage.getItem('lastChatViewed'),
          },
          author: { $ne: (store.user as User).name },
          $limit: 0,
        }
      : { author: { $ne: (store.user as User).name }, $limit: 0 },
  )
  .then((query) => comments.find({ query }))
  .then(({ total }) => {
    newMessages.set(total);
  });

comments.$changes.subscribe((changes) => {
  for (const { level, type, data } of changes) {
    if (level === 'instance' && type === 'created' && data.author !== (store.user as User).name) {
      newMessages.set(newMessages.get() + 1);
    }
  }
});

export const newData = new Stream(0, true);
comments.ready
  .then(() =>
    localStorage.getItem('lastDataViewed')
      ? {
          createdAt: {
            $gte: localStorage.getItem('lastDataViewed'),
          },
          action: 'dataset',
          author: { $ne: (store.user as User).name },
          $limit: 0,
        }
      : { action: 'dataset', author: { $ne: (store.user as User).name }, $limit: 0 },
  )
  .then((query) => comments.find({ query }))
  .then(({ total }) => {
    newData.set(total);
  });

comments.$changes.subscribe((changes) => {
  for (const { level, type, data } of changes) {
    if (
      level === 'instance' &&
      type === 'created' &&
      data.action === 'dataset' &&
      data.author !== (store.user as User).name
    ) {
      newData.set(newData.get() + 1);
    }
  }
});
