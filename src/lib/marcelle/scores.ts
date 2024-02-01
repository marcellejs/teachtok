import { dataset } from '@marcellejs/core';
import type { Comment, ImageInstance } from './datasets';
import { store } from './store';

const allComments = dataset<Comment>('comments', store);
const allInstances = dataset<ImageInstance>('training-set', store);
allInstances.sift({ public: true });

export async function getScores() {
  await allComments.ready;
  const rawScores: Record<string, { accuracy: number; instances: number; nClasses: number }> = [
    'A',
    'B',
    'C',
  ].reduce((s, x) => ({ ...s, [x]: { accuracy: 0, instances: 0, classes: 0 } }), {});
  for (const team of ['A', 'B', 'C']) {
    const { data } = await allComments.find({
      query: {
        team,
        action: 'dataset',
        $limit: 1,
        $sort: { createdAt: -1 },
      },
    });
    if (data.length === 1) {
      rawScores[team].accuracy = data[0].accuracy;
      rawScores[team].nClasses = data[0].nClasses;
    }
    const { total } = await allInstances.find({ query: { team, $limit: 0 } });
    rawScores[team].instances = total;
  }
  const scores = Object.entries(rawScores).map(([team, x]) => ({ team, ...x }));
  scores.sort((a, b) => {
    const sa = (a.accuracy * a.nClasses) / 10;
    const sb = (b.accuracy * b.nClasses) / 10;
    if (sa < sb) return 1;
    if (sa > sb) return -1;
    return 0;
  });

  return scores;
}
