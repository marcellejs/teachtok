import { genericChart, type ServiceIterable, Stream } from '@marcellejs/core';
import { $numClasses, comments } from './datasets';
import { $accuracy } from './inspect-errors';

import dayjs from 'dayjs';
import calendar from 'dayjs/plugin/calendar';

dayjs.extend(calendar);

export const collectiveAccuracy = new Stream<number>(0, true);
export const collectiveClasses = new Stream<number>(0, true);

export const accuracyChart = genericChart({
  preset: 'line',
  options: {
    scales: {
      y: { min: 0, max: 100 },
      x: {
        display: true,
        title: {
          display: true,
          text: 'Date',
        },
      },
    },
  },
});
accuracyChart.title = 'Accuracy over time';

comments.ready.then(async () => {
  const points = await (
    comments
      .items()
      .query({ action: 'dataset', $sort: { createdAt: 1 } }) as unknown as ServiceIterable<{
      createdAt: string;
      accuracy: number;
    }>
  ).toArray();
  const labels = points.map((x) => x.createdAt).concat([new Date(Date.now()).toISOString()]);
  const values = points.map((x) => x.accuracy);
  collectiveAccuracy.set(values[values.length - 1]);
  accuracyChart.addSeries($accuracy.map((acc) => [...values, acc]).hold(), "My Team's Accuracy", {
    borderColor: 'rgb(102, 204, 138)',
    backgroundColor: 'rgba(102, 204, 138, 0.3)',
    segment: {
      borderColor: (context) => {
        if (context.p1DataIndex < values.length) {
          return 'rgb(58, 191, 248)';
        }
        return 'rgb(102, 204, 138)';
      },
      backgroundColor: (context) => {
        if (context.p1DataIndex < values.length) {
          return 'rgba(58, 191, 248, 0.3)';
        }
        return 'rgba(102, 204, 138, 0.3)';
      },
    },
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    borderColor: (context) => {
      if (context.dataIndex !== undefined && context.dataIndex < values.length) {
        return 'rgb(58, 191, 248)';
      }
      return 'rgb(102, 204, 138)';
    },
    fill: 'start',
    labels: labels.map((x) => dayjs(x).calendar()),
  });
});

export const numClassesChart = genericChart({
  preset: 'line',
  options: {
    scales: {
      y: { min: 0, ticks: { stepSize: 1 } },
      x: {
        display: true,
        title: {
          display: true,
          text: 'Date',
        },
      },
    },
  },
});
numClassesChart.title = 'Number of classes over time';

comments.ready.then(async () => {
  const points = await (
    comments
      .items()
      .query({ action: 'dataset', $sort: { createdAt: 1 } }) as unknown as ServiceIterable<{
      createdAt: string;
      nClasses: number;
    }>
  ).toArray();
  const labels = points.map((x) => x.createdAt).concat([new Date(Date.now()).toISOString()]);
  const values = points.map((x) => x.nClasses);
  collectiveClasses.set(values[values.length - 1]);
  numClassesChart.addSeries(
    $numClasses.map((acc) => [...values, acc]).hold(),
    "My Team's Number of Classes",
    {
      borderColor: 'rgb(102, 204, 138)',
      backgroundColor: 'rgba(102, 204, 138, 0.3)',
      segment: {
        borderColor: (context) => {
          if (context.p1DataIndex < values.length) {
            return 'rgb(58, 191, 248)';
          }
          return 'rgb(102, 204, 138)';
        },
        backgroundColor: (context) => {
          if (context.p1DataIndex < values.length) {
            return 'rgba(58, 191, 248, 0.3)';
          }
          return 'rgba(102, 204, 138, 0.3)';
        },
      },
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      borderColor: (context) => {
        if (context.dataIndex !== undefined && context.dataIndex < values.length) {
          return 'rgb(58, 191, 248)';
        }
        return 'rgb(102, 204, 138)';
      },
      fill: 'start',
      labels: labels.map((x) => dayjs(x).calendar()),
    },
  );
});
