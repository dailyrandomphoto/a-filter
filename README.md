# a-filter

[![NPM Version][npm-version-image]][npm-url]
[![LICENSE][license-image]][license-url]
[![Build Status][travis-image]][travis-url]
[![code style: prettier][code-style-prettier-image]][code-style-prettier-url]

A simple filter. Recursively filtering an object or array.

Array.prototype.filter for `objects`.
Learn more about [Array.prototype.filter](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter).

## Installation

```sh
npm install a-filter
```

## Usages

```js
const filter = require("a-filter");

const words = [
  "spray",
  "limit",
  "elite",
  "exuberant",
  "destruction",
  "present",
];

const result = filter(words, (word) => word.length > 6);

console.log(result);
// expected output: Array ["exuberant", "destruction", "present"]
```

```js
const filter = require("a-filter");

const obj = {
  a: "aa",
  b: "bb",
  c: "cc",
  d: {
    da: "ddaa",
    db: "ddbb",
    dc: "ddcc",
  },
};
const predicate = (v, k) => {
  return k !== "b" && k !== "db";
};
const options = { recursive: true };

const result = filter(obj, predicate, options);
// expected output:
// {
//   a: 'aa',
//   c: 'cc',
//   d: {
//     da: 'ddaa',
//     dc: 'ddcc'
//   }
// }
```

## API

### filter (object, predicate [, options])

**Parameters**

- `object` _Object or Array_ - The source object or array.
- `predicate` _Function_ - The function invoked per property.
  - value | element - The current element being processed in the array.
  - key | index - The index of the current element being processed in the array.
  - object | array - The `array` filter was called upon.
  - `context`
    - `root` - The `object` or `array` filter was called upon.
    - `name` - key of current `object`
    - `level` - level of current `object`
    - `parent` - parent object of current `object`
    - `path` - path of current `object`
- `options`
  - `recursive` _(default: false)_ - Recursively filtering array and plain object properties.
  - `filterArray` _(default: false)_ - Filter array recursively.
- `thisArg` - Value to use as `this` when executing `predicate` callback.

**Return value**

A new array with the elements that pass the test. If no elements pass the test, an empty array will be returned.

## Related

- [Array.prototype.filter](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter).

## License

Copyright (c) 2020 [dailyrandomphoto][my-url]. Licensed under the [MIT license][license-url].

[my-url]: https://github.com/dailyrandomphoto
[npm-url]: https://www.npmjs.com/package/a-filter
[travis-url]: https://travis-ci.org/dailyrandomphoto/a-filter
[license-url]: LICENSE
[code-style-prettier-url]: https://github.com/prettier/prettier
[npm-downloads-image]: https://img.shields.io/npm/dm/a-filter
[npm-version-image]: https://img.shields.io/npm/v/a-filter
[license-image]: https://img.shields.io/npm/l/a-filter
[travis-image]: https://img.shields.io/travis/dailyrandomphoto/a-filter
[code-style-prettier-image]: https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square
