import { flatMapIt } from './transform';

export function augmentArrays() {
  if (!('flatMap' in Array.prototype)) {
    (Array.prototype as any).flatMap = function (convert: (element: any) => any) {
      flatMapIt(this, convert);
    };
  }
}
