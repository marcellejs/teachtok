import { Activity } from './activity.component';

export function activity(...args: ConstructorParameters<typeof Activity>) {
  return new Activity(...args);
}
