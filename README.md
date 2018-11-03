A-Iterable
=========

[![NPM][npm-image]][npm-url]
[![CircleCI][ci-image]][ci-url]
[![codecov][codecov-image]][codecov-url]

`AIterable` is an abstract implementation of ES6 `Iterable` interface with methods of `Array`, like `forEach`, `reduce`,
`filter`, `map`, etc. Unlike arrays these methods return `AIterable` instances instead of arrays.

Arrays considered implementing an `AIterable` interface as soon as they contain all expected methods.

The library is implemented in TypeScript and relies on `tslib` in iteration and generators support.

Execution environment is expected to be es2015-compliant. So, polyfills like [core-js] may be of use.

An `AIterable` interface contains only basic methods, not every one from the `Array` interface. The rest of the
functionality could be achieved with the use of simple [utilities] this package also hosts.

[utilities]: #utilities
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


`RevertibleIterable`
--------------------

[RevertibleIterable]: #revertibleiterable

The library contains a `RevertibleIterable` implemented by `AIterable`. It extends the standard `Iterable` interface
with `reverse()` method, that constructs an iterable containing original iterable's elements in reverse order.

Arrays implement this interface. Note however, that the array counterpart reverses elements _in place_ rather than
creating a new array.


`AIterable`
-----------

This is an abstract class implementing [RevertibleIterable] interface and a subset of Array-like API.


### `AIterable.none()`

Returns an iterable without elements.

```TypeScript
import { AIterable } from 'a-iterable';

expect(AIterable.none()[Symbol.iterator]().next().done).toBe(true);
```


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

[AIterable.of()]: #aiterableof


### `AIterable.from()`

Converts the source `Iterable` to `AIterable`.

Unlike [AIterable.of()] this function always creates new iterable instance. This may be useful when converting array 
and iterating over its elements. This way new array instances won't be created.

Uses [reverseIt()] function to revert the constructed iterable.

```TypeScript
import { AIterable, itsFirst } from 'a-iterable';

itsFirst(AIterable.from([1, 2, 3]).filter(x => x > 1)); // 2
```

### `every()`

Tests whether all elements pass the test implemented by the provided function. Corresponds to [Array.prototype.every()].

```TypeScript
import { AIterable } from 'a-iterable';

const numbers = AIterable.from([1, 30, 39, 29, 10, 13]);

numbers.every(x => x < 40); // true
numbers.every(x => x < 20); // false
```

[Array.prototype.every()]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/every


### `filter()`

Creates an iterable with all elements that pass the test implemented by the provided function. Corresponds to 
[Array.prototype.filter()].

```TypeScript
import { AIterable } from 'a-iterable';

const words = AIterable.of(['spray', 'limit', 'elite', 'exuberant', 'destruction', 'present']);

words.filter(word => word.length > 6); // "exuberant", "destruction", "present"
```

[Array.prototype.filter()]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter


### `flatMap()`

First maps each element using a mapping function, then flattens the result into a new iterable. Corresponds to
[Array.prototype.flatMap()].

```TypeScript
import { AIterable } from 'a-iterable';

const numbers = AIterable.of([1, 2, 3]);

numbers.flatMap(x => [x, x + 10]); // 1, 11, 2, 12, 3, 13
```


[Array.prototype.flatMap()]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/flatMap


### `forEach()`

Performs the given action for each element. Corresponds to [Array.prototype.forEach()].

```TypeScript
import { AIterable } from 'a-iterable';

AIterable.is([1, 2, 3]).forEach(console.log); // 1, 2, 3
```

[Array.prototype.forEach()]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach


### `map()`

Creates a new iterable with the results of calling a provided function on every element.
Corresponds to [Array.prototype.map()].

```TypeScript
import { AIterable } from 'a-iterable';

const numbers = AIterable.of([1, 4, 9, 16]);

numbers.map(x => x * 2); // 2, 8, 18, 32
```

[Array.prototype.map()]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map


### `reduce()`

Applies a function against an accumulator and each element to reduce elements to a single value.
Corresponds to [Array.prototype.reduce()].

```TypeScript
import { AIterable } from 'a-iterable';

const numbers = AIterable.of([1, 2, 3, 4]);

numbers.reduce((accumulator, currentValue) => accumulator + currentValue, 0); // 10
```

[Array.prototype.reduce()]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce

### `reverse()`

Constructs an iterable containing this iterable's elements in reverse order.

Corresponds to [Array.prototype.reverse()]. Note however, that the array counterpart reverses elements _in place_
rather than creating a new array.

```TypeScript
import { AIterable } from 'a-iterable';

const numbers = [1, 2, 3, 4];
const iter1 = AIterable.from(numbers);

iter1.reverse(); // [4, 3, 2, 1], `numbers` are also reverted.
```


[Array.prototype.reverse()]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reverse


Utilities
---------

### `itsEmpty()`

Checks whether the given iterable is empty.

```TypeScript
import { AIterable, itsEmpty } from 'a-iterable';  

!itsEmpty(AIterable.from([1, 2, 3]).filter(x => x === 2)); // `Array.includes()` analog
!itsEmpty(AIterable.from([1, 2, 3]).filter(x => x > 1)); // `Array.some()` analog
```

### `itsFirst()`

Returns the first element of the given iterable.

```TypeScript
import { AIterable, itsFirst } from 'a-iterable';  

itsFirst(AIterable.from([1, 2, 3]).filter(x => x === 2)); // `Array.find()` analog
```


### `itsLast()`

Returns the last element of the given iterable.

If the given iterable is an array, then just returns its last element. If it is revertible, then extracts the first
element of reverted iterable. Otherwise iterates over elements to find the last one.

```TypeScript
import { itsLast } from 'a-iterable';

itsLast([1, 2, 3]); // 3
```


### `reverseIt()`

[reverseIt()]: #reverseit

Constructs a reversed iterable.

If the `source` iterable is an array, then uses [reverseArray()] function to revert the constructed iterable.
If the `source` iterable is revertible, then uses its `reverse()` method to revert the constructed one.
Otherwise stores elements to array and reverts them with [reverseArray()] function.

```TypeScript
import { reverseIt } from 'a-iterable';

reverseIt([1, 2 ,3]); // [3, 2, 1]
```


### `reverseArray()`

[reverseArray()]: #reversearray

Constructs an iterable of array elements in reverse order.

```TypeScript
import { reverseArray } from 'a-iterable';

reverseArray([1, 2 ,3]); // [3, 2, 1]
```
