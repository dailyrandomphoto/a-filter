function filter(target, callback, options, thisArg) {
  'use strict';

  if (!target) {
    return target;
  }

  if (typeof callback !== 'function') {
    throw new TypeError('\'callback\' has to be a function');
  }

  if (Array.isArray(target)) {
    return target.filter(callback, thisArg);
  }

  options = {...options};
  const hasOwn = Object.prototype.hasOwnProperty;
  const root = target;
  const context = {root, name: null, level: 1, parent: {value: null, parent: null}, path: ''};

  function _filter(target, context) {
    // Const obj = Object(target);
    const obj = target;
    const res = {};

    for (const key in obj) {
      if (!hasOwn.call(obj, key)) {
        continue;
      }

      let kValue = obj[key];
      if (options.recursive && kValue && typeof kValue === 'object') {
        if (Array.isArray(kValue)) {
          if (options.filterArray) {
            kValue = kValue.filter(callback, thisArg);
          }
        } else {
          const contextCur = {
            ...context,
            name: key,
            level: context.level + 1,
            parent: {value: target, parent: context.parent},
            path: context.path + '/' + key
          };
          kValue = _filter(kValue, contextCur);
        }
      }

      if (callback.call(thisArg, kValue, key, obj, context)) {
        res[key] = kValue;
      }
    }

    return res;
  }

  return _filter(target, context);
}

module.exports = filter;
