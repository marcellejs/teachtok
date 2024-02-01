import { dataset, type Instance } from '@marcellejs/core';
import { store } from './store';

type EventType = 'navigate' | 'upload' | 'prediction' | 'inspect-confusion' | 'inspect-prediction';

const log = dataset<Instance>('log', store);

export function logEvent(type: EventType, data: unknown = undefined) {
  log.ready.then(() => {
    log.create({
      type,
      data,
    });
  });
}
