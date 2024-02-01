import { EnsembleClassifier } from './ensemble-classifier.component';

export function ensembleClassifier(...args: ConstructorParameters<typeof EnsembleClassifier>): EnsembleClassifier {
  return new EnsembleClassifier(...args);
}

export type { EnsembleClassifier };
