import { flatMapIt } from './transform';

/**
 * @internal
 */
export function augmentArrays(): void {
  if (!('flatMap' in Array.prototype)) {
    (Array.prototype as any).flatMap = function (convert: (element: any) => any) {
      flatMapIt(this, convert);
    };
  }
}
