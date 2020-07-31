function filter(target, predicate, options, thisArg) {
  'use strict';

  if (!target) {
    return target;
  }

  if (typeof predicate !== 'function') {
    throw new TypeError("'predicate' has to be a function");
  }

  if (Array.isArray(target)) {
    // `predicate` is invoked with three arguments: element, index, array
    return target.filter(predicate, thisArg); // eslint-disable-line unicorn/no-fn-reference-in-iterator
  }

  options = { ...options };
  const hasOwn = Object.prototype.hasOwnProperty;
  const root = target;
  const context = {
    root,
    name: null,
    level: 1,
    parent: { value: null, parent: null },
    path: ''
  };

  function _filter(target, context) {
    // const object = Object(target);
    const object = target;
    const result = {};

    for (const key in object) {
      if (!hasOwn.call(object, key)) {
        continue;
      }

      let kValue = object[key];
      if (options.recursive && kValue && typeof kValue === 'object') {
        if (Array.isArray(kValue)) {
          if (options.filterArray) {
            // `predicate` is invoked with three arguments: element, index, array
            kValue = kValue.filter(predicate, thisArg); // eslint-disable-line unicorn/no-fn-reference-in-iterator
          }
        } else {
          const contextCur = {
            ...context,
            name: key,
            level: context.level + 1,
            parent: { value: target, parent: context.parent },
            path: context.path + '/' + key
          };
          kValue = _filter(kValue, contextCur);
        }
      }

      // `predicate` is invoked with four arguments: value, key, object, context
      if (predicate.call(thisArg, kValue, key, object, context)) {
        result[key] = kValue;
      }
    }

    return result;
  }

  return _filter(target, context);
}

module.exports = filter;
