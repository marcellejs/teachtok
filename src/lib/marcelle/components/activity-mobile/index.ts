import { ActivityMobile } from './activity-mobile.component';

export function activityMobile(...args: ConstructorParameters<typeof ActivityMobile>): ActivityMobile {
  return new ActivityMobile(...args);
}
