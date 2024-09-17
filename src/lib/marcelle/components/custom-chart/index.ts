import { CustomChart } from './custom-chart.component';

export function customChart(...args: ConstructorParameters<typeof CustomChart>): CustomChart {
  return new CustomChart(...args);
}

export type { CustomChart };
