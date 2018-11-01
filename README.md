AIterable
=========

[![NPM][npm-image]][npm-url]
[![CircleCI][ci-image]][ci-url]
[![codecov][codecov-image]][codecov-url]

`AIterable` is an abstract implementation of ES6 `Iterable` interface with methods of `Array`, like `forEach`, `reduce`,
`filter`, `map`, etc. Unlike arrays these methods return `AIterable` instances instead of arrays.

Arrays considered implementing an `AIterable` interface as soon as they contain all expected methods.

An implementation is implemented in TypeScript and relies on `tslib` in iteration and generators support.

Execution environment is expected to be es2015-compliant. So, polyfills like [core-js] may be of use. 

[core-js]: https://www.npmjs.com/package/core-js
[npm-image]: https://img.shields.io/npm/v/a-iterable.svg
[npm-url]: https://www.npmjs.com/package/a-iterable
[ci-image]:https://circleci.com/gh/surol/a-iterable.svg?style=shield
[ci-url]:https://circleci.com/gh/surol/a-iterable  
[codecov-image]: https://codecov.io/gh/surol/a-iterable/branch/master/graph/badge.svg
[codecov-url]: https://codecov.io/gh/surol/a-iterable 


Example
-------

```TypeScript
import { AIterable } from 'a-iterable';

const it = AIterable.of({
  *[Symbol.iterator]() {
    yield 1;
    yield 2;
    yield 3;
  }
});

expect([...it.map(item => item * item)]).toBe([1, 4, 9]);

```


API
___

### `AIterable.is()`

Checks whether the source `Iterable` implements an `AIterable` interface.

```TypeScript
import { AIterable } from 'a-iterable';

AIterable.is([1, 2, 3]); // true
AIterable.is({ *[Symbol.iterator]() { yield 'something'; } }); // false
```


### `AIterable.of()`

Converts the source `Iterable` to `AIterable` if necessary.

```TypeScript
import { AIterable } from 'a-iterable';

AIterable.of([1, 2, 3]);
AIterable.of({ *[Symbol.iterator]() { yield 'something'; } });
```

When called for the object already implementing `AIterable` (such as `Array`), this method returns the source
object itself.
