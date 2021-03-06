> Discontinued in favor of [@proc7ts/push-iterator](https://github.com/proc7ts/push-iterator)

A-Iterable
==========

[![NPM][npm-image]][npm-url]
[![Build Status][build-status-img]][build-status-link]
[![codecov][codecov-image]][codecov-url]
[![GitHub Project][github-image]][github-url]
[![API Documentation][api-docs-image]][api-docs-url]

`AIterable` is an abstract implementation of ES6 `Iterable` interface with methods of `Array`, like `forEach`, `reduce`,
`filter`, `map`, etc. Unlike arrays these methods return `AIterable` instances instead of arrays.

Arrays considered implementing an `AIterable` interface as soon as they contain all expected methods.

The library is implemented in TypeScript and relies on `tslib` in iteration and generators support.

Execution environment is expected to be es2015-compliant. So, polyfills like [core-js] may be of use.

An `AIterable` interface contains only basic methods, not every one from the `Array` interface. The rest of the
functionality could be achieved with the use of simple [utilities] this package also hosts.

Every `AIterable` method has an utility function counterpart, that performs the same operation over plain `Iterable`.
You can use these functions if you don't want to deal with `AIterable` class, as they are tree-shakeable.
This is advised approach when your code utilizes only a few functions. However, an `AIterable` class is more handy
and does not add too much of the code to the final bundle. 

[utilities]: #utilities
[core-js]: https://www.npmjs.com/package/core-js
[npm-image]: https://img.shields.io/npm/v/@proc7ts/a-iterable.svg?logo=npm
[npm-url]: https://www.npmjs.com/package/@proc7ts/a-iterable
[build-status-img]: https://github.com/proc7ts/a-iterable/workflows/Build/badge.svg
[build-status-link]: https://github.com/proc7ts/a-iterable/actions?query=workflow%3ABuild
[codecov-image]: https://codecov.io/gh/proc7ts/a-iterable/branch/master/graph/badge.svg
[codecov-url]: https://codecov.io/gh/proc7ts/a-iterable
[github-image]: https://img.shields.io/static/v1?logo=github&label=GitHub&message=project&color=informational
[github-url]: https://github.com/proc7ts/a-iterable
[api-docs-image]: https://img.shields.io/static/v1?logo=typescript&label=API&message=docs&color=informational
[api-docs-url]: https://proc7ts.github.io/a-iterable/


Example
-------

```typescript
import { AIterable } from '@proc7ts/a-iterable';

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


`ArrayLikeIterable`
-------------------

[ArrayLikeIterable]: #arraylikeiterable

An iterable with Array-like iteration operations. Both `Array` and `AIterable` implement it.


`AIterable`
-----------

Abstract `Iterable` implementation with array-like iteration operations.


### `AIterable.none()`

Returns an iterable without elements.

```typescript
import { AIterable } from '@proc7ts/a-iterable';

expect(AIterable.none()[Symbol.iterator]().next().done).toBe(true);
```


### `AIterable.is()`

Checks whether the given iterable is an array-like one.

```typescript
import { AIterable } from '@proc7ts/a-iterable';

AIterable.is([1, 2, 3]); // true
AIterable.is({ *[Symbol.iterator]() { yield 'something'; } }); // false
```


### `AIterable.of()`

Creates an `AIterable` instance that iterates over the same elements as the given one if necessary.

```typescript
import { AIterable } from '@proc7ts/a-iterable';

AIterable.of([1, 2, 3]);
AIterable.of({ *[Symbol.iterator]() { yield 'something'; } });
```

When called for the object already implementing `ArrayLikeIterable` (such as `Array`), this method returns the source
object itself.

[AIterable.of()]: #aiterableof


### `AIterable.from()`

Creates an `AIterable` instance that iterates over the same elements as the given one.

Unlike [AIterable.of()] this function always creates new `AIterable` instance. This may be useful when converting array 
and iterating over its elements. This way new array instances won't be created.

Uses [reverseIt()] function to reverse the constructed iterable.

```typescript
import { AIterable, itsFirst } from '@proc7ts/a-iterable';

itsFirst(AIterable.from([1, 2, 3]).filter(x => x > 1)); // 2
```

### `every()`

Tests whether all elements pass the test implemented by the provided function. Corresponds to [Array.prototype.every()].

The utility function counterpart operating over plain iterables is `itsEvery()`.

```typescript
import { AIterable, itsEvery } from '@proc7ts/a-iterable';

const numbers = AIterable.from([1, 30, 39, 29, 10, 13]);

numbers.every(x => x < 40);     // true
itsEvery(numbers, x => x < 40); // Plain iterable counterpart
numbers.every(x => x < 20);     // false
itsEvery([], x => false);       // Always `true` for empty iterable
```

[Array.prototype.every()]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/every


### `filter()`

Creates an iterable with all elements that pass the test implemented by the provided function. Corresponds to 
[Array.prototype.filter()].

The utility function counterpart operating over plain iterables is `filterIt()`.

```typescript
import { AIterable, filterIt } from '@proc7ts/a-iterable';

const words = AIterable.of(['spray', 'limit', 'elite', 'exuberant', 'destruction', 'present']);

words.filter(word => word.length > 6); // "exuberant", "destruction", "present"
filterIt(words, word => word.length > 6); // Plain iterable counterpart
```

[Array.prototype.filter()]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter


### `flatMap()`

First maps each element using a mapping function, then flattens the result into a new iterable. Corresponds to
[Array.prototype.flatMap()].

The utility function counterpart operating over plain iterables is `flatMapIt()`.

```typescript
import { AIterable, flatMapIt } from '@proc7ts/a-iterable';

const numbers = AIterable.of([1, 2, 3]);

numbers.flatMap(x => [x, x + 10]); // 1, 11, 2, 12, 3, 13
flatMapIt(numbers, x => [x, x + 10]); // Plain iterable counterpart
```

[Array.prototype.flatMap()]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/flatMap


### `forEach()`

Performs the given action for each element. Corresponds to [Array.prototype.forEach()].

The utility function counterpart operating over plain iterables is `itsEach()`.

```typescript
import { AIterable, itsEach } from '@proc7ts/a-iterable';

AIterable.is([1, 2, 3]).forEach(console.log); // 1, 2, 3
itsEach([1, 2, 3], console.log); // Plain iterable counterpart
```

[Array.prototype.forEach()]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach


### `map()`

Creates a new iterable with the results of calling a provided function on every element.
Corresponds to [Array.prototype.map()].

The utility function counterpart operating over plain iterables is `mapIt()`.

```typescript
import { AIterable, mapIt } from '@proc7ts/a-iterable';

const numbers = AIterable.of([1, 4, 9, 16]);

numbers.map(x => x * 2); // 2, 8, 18, 32
mapIt(numbers, x => x * 2); // Plain iterable counterpart
```

[Array.prototype.map()]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map


### `reduce()`

Applies a function against an accumulator and each element to reduce elements to a single value.
Corresponds to [Array.prototype.reduce()].

The utility function counterpart operating over plain iterables is `itsReduction()`.

```typescript
import { AIterable, itsReduction } from '@proc7ts/a-iterable';

const numbers = AIterable.of([1, 2, 3, 4]);

numbers.reduce((accumulator, currentValue) => accumulator + currentValue, 0); // 10
itsReduction(numbers, (accumulator, currentValue) => accumulator + currentValue, 0); // Plain iterable counterpart
```

[Array.prototype.reduce()]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce


### `reverse()`

Constructs an iterable containing this iterable's elements in reverse order.

Corresponds to [Array.prototype.reverse()]. Note however, that the array counterpart reverses elements _in place_
rather than creating a new array.

The utility function counterpart operating over plain iterables is `reverseIt()`.

```typescript
import { AIterable, reverseIt } from '@proc7ts/a-iterable';

const numbers = [1, 2, 3, 4];
const iter = AIterable.from(numbers);

iter.reverse(); // 4, 3, 2, 1
reverseIt(numbers); // Plain iterable counterpart
```

[Array.prototype.reverse()]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reverse


### `some()`

Tests whether some element passed the test implemented by the provided function. Corresponds to
[Array.prototype.some()].

The utility function counterpart operating over plain iterables is `itsSome()`.

```typescript
import { AIterable, itsSome } from '@proc7ts/a-iterable';

const numbers = AIterable.from([1, 30, 39, 29, 10, 13]);

numbers.some(x => x < 2);     // true
itsSome(numbers, x => x < 2); // Plain iterable counterpart
numbers.some(x => x > 40);    // false
itsSome([], x => true);       // Always `false` for empty iterables
```

[Array.prototype.some()]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/some


### `thru()`

Passes each element of this iterable trough a chain of transformation passes.

The passes are preformed by [@proc7ts/call-thru] library.

The utility function counterpart operating over plain iterables is `thruIt()`.

```typescript
import { AIterable, passIf, thruIt } from '@proc7ts/a-iterable';

const numbers = [1, 2, 3];
const iter = AIterable.from(numbers);

iter.thru(
    passIf((n: number) => n > 1),
    n => n * n,
); // 4, 9
thruIt(
    passIf((n: number) => n > 1),
    n => n * n,    
); // Plain iterable counterpart
```


[@proc7ts/call-thru]: https://npmjs.com/package/@proc7ts/call-thru


`extendIterable()`
------------------

Extends an iterable class with `AIterable` API.

```typescript
import { AIterable, toAIterable } from '@proc7ts/a-iterable';

class BaseIterable implements Iterable<number> {
  * [Symbol.iterator](): Iterator<number> {
    yield 1;
    yield 2;
    yield 3;
  }
}

const ExtendedIterable = toAIterable(BaseIterable);
const extended = new ExtendedIterable();

extended.forEach(console.log); // Prints 1, 2, 3 as `forEach` method is present in `ExtendedIterable`
```


Utilities
---------


### `itsEmpty()`

Checks whether the given iterable is empty.

```typescript
import { AIterable, itsEmpty } from '@proc7ts/a-iterable';  

!itsEmpty(AIterable.from([1, 2, 3]).filter(x => x === 2)); // `Array.includes()` analog
!itsEmpty(AIterable.from([1, 2, 3]).filter(x => x > 1)); // `Array.some()` analog
```

### `itsFirst()`

Returns the first element of the given iterable.

```typescript
import { AIterable, itsFirst } from '@proc7ts/a-iterable';  

itsFirst(AIterable.from([1, 2, 3]).filter(x => x === 2)); // `Array.find()` analog
```


### `itsLast()`

Returns the last element of the given iterable.

If the given `iterable` is an array-like structure, then just returns its last element. If it is revertible,
then extracts the first element of the reverted one. Otherwise iterates over elements to find the last one.

```typescript
import { itsLast } from '@proc7ts/a-iterable';

itsLast([1, 2, 3]); // 3
```


### `itsIterator()`

Starts iteration over the given iterable.

This is a shortcut for `iterable[Symbol.iterator]` to make it friendlier to minification.

```typescript
import { itsIterator } from '@proc7ts/a-iterable';

itsIterator([1, 2, 3]).next().value; // 1
```


### `makeIt()`

Creates custom iterable.

```typescript
import { itsIterator, makeIt } from '@proc7ts/a-iterable';

const array = [1, 2, 3];

makeIt(() => itsIterator(array)); // Iterable over array elements
makeIt(() => itsIterable(array), () => [...array].reverse()); // Revertible iterable over array elements 
```


### `overArray()`

Builds an revertible iterable over elements of array-like structure, like `Array` or DOM `NodeList`.

```typescript
import { overArray } from '@proc7ts/a-iterable';

expect([...overArray([1, 2, 3])]).toEqual([1, 2, 3]);
expect([...overArray([1, 2, 3]).reverse()]).toEqual([3, 2, 1]);
```


### `overEntries()`

Builds an iterable over the key/value entries of the given object.

```typescript
import { overEntries } from '@proc7ts/a-iterable';

overEntries({
  a: 1,
  [1]: 'one',
  [Symbol.iterator]: null,
}) // Contains `['a', 1]`, `['1', 'one']`, and `[Symbol.iterator, null]`
```


### `overKeys()`

Builds an iterable over the keys of the given object.

```typescript
import { overKeys } from '@proc7ts/a-iterable';

overKeys({
  a: 1,
  [1]: 'one',
  [Symbol.iterator]: null,
}) // Contains `'a'`, `'1'`, and `Symbol.iterator`
```


### `overNone()`

Returns an iterable without elements revertible to itself.

```typescript
import { overNone } from '@proc7ts/a-iterable';

expect([...overNone()]).toEqual([]);
expect([...overNone().reverse()]).toEqual([]);
```


### `reverseIt()`

[reverseIt()]: #reverseit

Constructs a reversed iterable.

If the `source` iterable is an array, then uses [reverseArray()] function to revert the constructed iterable.
If the `source` iterable is revertible, then uses its `reverse()` method to revert the constructed one.
Otherwise stores elements to array and reverts them with [reverseArray()] function.

```typescript
import { reverseIt } from '@proc7ts/a-iterable';

reverseIt([1, 2 ,3]); // [3, 2, 1]
```


### `reverseArray()`

[reverseArray()]: #reversearray

Constructs an iterable of array-like structure elements in reverse order.

```typescript
import { reverseArray } from '@proc7ts/a-iterable';

reverseArray([1, 2 ,3]); // [3, 2, 1]
```
