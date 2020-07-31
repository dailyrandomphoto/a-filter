'use strict';

const { expect } = require('chai');
const filter = require('a-filter');

describe('a-filter', () => {
  it('should return null', () => {
    const object = null;
    const predicate = (v) => v;
    const expected = null;

    expect(filter(object, predicate)).to.deep.eql(expected);
  });

  it('should throw error', () => {
    const object = { a: 'aa' };
    const predicate = ['not a function'];

    expect(() => filter(object, predicate)).to.throw(TypeError);
  });

  it('should call Array.prototype.filter', () => {
    const object = ['a', null, 'b', null];
    const predicate = (v) => v;

    expect(filter(object, predicate)).to.deep.eql(object.filter(predicate)); // eslint-disable-line unicorn/no-fn-reference-in-iterator
  });

  it('filter by key', () => {
    const object = {
      a: 'aa',
      b: 'bb',
      c: 'cc'
    };
    const predicate = (v, k) => {
      return k !== 'b';
    };

    const expected = {
      a: 'aa',
      c: 'cc'
    };

    expect(filter(object, predicate)).to.deep.eql(expected);
  });

  it('filter by key - recursive', () => {
    const object = {
      a: 'aa',
      b: 'bb',
      c: 'cc',
      d: {
        da: 'ddaa',
        b: 'bb',
        dc: 'ddcc'
      }
    };
    const predicate = (v, k) => {
      return k !== 'b';
    };

    const options = { recursive: true };
    const expected = {
      a: 'aa',
      c: 'cc',
      d: {
        da: 'ddaa',
        dc: 'ddcc'
      }
    };

    expect(filter(object, predicate, options)).to.deep.eql(expected);
  });

  it('filter by value', () => {
    const object = {
      a: 'aa',
      b: 'bb',
      c: 'cc'
    };
    const predicate = (v) => {
      return v !== 'cc';
    };

    const expected = {
      a: 'aa',
      b: 'bb'
    };

    expect(filter(object, predicate)).to.deep.eql(expected);
  });

  it('filter by value - recursive', () => {
    const object = {
      a: 'aa',
      b: 'bb',
      c: 'cc',
      d: {
        da: 'ddaa',
        db: 'ddbb',
        dc: 'cc'
      }
    };
    const predicate = (v) => {
      return v !== 'cc';
    };

    const options = { recursive: true };
    const expected = {
      a: 'aa',
      b: 'bb',
      d: {
        da: 'ddaa',
        db: 'ddbb'
      }
    };

    expect(filter(object, predicate, options)).to.deep.eql(expected);
  });

  it('filter empty', () => {
    const object = {
      a: 'aa',
      b: undefined,
      c: null,
      d: '',
      e: [],
      f: {}
    };
    const predicate = (v) => Boolean(v);
    const expected = {
      a: 'aa',
      e: [],
      f: {}
    };

    expect(filter(object, predicate)).to.deep.eql(expected);
  });

  it('filter empty(2)', () => {
    const object = {
      a: 'aa',
      b: undefined,
      c: null,
      d: '',
      e: [],
      f: {}
    };
    const predicate = (v) => v;
    const expected = {
      a: 'aa',
      e: [],
      f: {}
    };

    expect(filter(object, predicate)).to.deep.eql(expected);
  });

  it('filter null', () => {
    const object = {
      a: 'aa',
      b: undefined,
      c: null,
      d: '',
      e: [],
      f: {}
    };
    const predicate = (v) => v != null; // eslint-disable-line no-eq-null,eqeqeq

    const expected = {
      a: 'aa',
      d: '',
      e: [],
      f: {}
    };

    expect(filter(object, predicate)).to.deep.eql(expected);
  });

  it('filter null - recursive', () => {
    const object = {
      a: 'aa',
      b: undefined,
      c: null,
      d: '',
      e: ['ee', undefined, null, '', []],
      f: {},
      g: {
        ga: 'ggaa',
        gb: undefined,
        gc: null,
        gd: '',
        ge: [],
        gf: {}
      }
    };
    const predicate = (v) => {
      return v != null; // eslint-disable-line no-eq-null,eqeqeq
    };

    const options = { recursive: true };
    const expected = {
      a: 'aa',
      d: '',
      e: ['ee', undefined, null, '', []],
      f: {},
      g: {
        ga: 'ggaa',
        gd: '',
        ge: [],
        gf: {}
      }
    };

    expect(filter(object, predicate, options)).to.deep.eql(expected);
  });

  it('filter null - recursive,filterArray', () => {
    const object = {
      a: 'aa',
      b: undefined,
      c: null,
      d: '',
      e: ['ee', undefined, null, '', []],
      f: {},
      g: {
        ga: 'ggaa',
        gb: undefined,
        gc: null,
        gd: '',
        ge: [],
        gf: {}
      }
    };
    const predicate = (v) => {
      return v != null; // eslint-disable-line no-eq-null,eqeqeq
    };

    const options = { recursive: true, filterArray: true };
    const expected = {
      a: 'aa',
      d: '',
      e: ['ee', '', []],
      f: {},
      g: {
        ga: 'ggaa',
        gd: '',
        ge: [],
        gf: {}
      }
    };

    expect(filter(object, predicate, options)).to.deep.eql(expected);
  });

  it('filter null and empty objects - recursive', () => {
    const object = {
      a: 'aa',
      b: undefined,
      c: null,
      d: '',
      e: [],
      f: {},
      g: {
        ga: 'ggaa',
        gb: undefined,
        gc: null,
        gd: '',
        ge: [],
        gf: {}
      },
      h: {},
      i: {
        ia: undefined,
        ib: null,
        ic: {},
        id: {
          ida: undefined,
          idb: null,
          idc: {}
        }
      }
    };
    const predicate = (v) => {
      // eslint-disable-next-line no-eq-null,eqeqeq
      if (v == null) {
        return false;
      }

      if (
        typeof v === 'object' &&
        !Array.isArray(v) &&
        Object.keys(v).length === 0
      ) {
        return false;
      }

      return true;
    };

    const options = { recursive: true };
    const expected = {
      a: 'aa',
      d: '',
      e: [],
      g: {
        ga: 'ggaa',
        gd: '',
        ge: []
      }
    };

    expect(filter(object, predicate, options)).to.deep.eql(expected);
  });

  it('filter by path - recursive', () => {
    const object = {
      a: 'aa',
      b: undefined,
      c: null,
      d: '',
      e: [],
      f: {},
      g: {
        ga: 'ggaa',
        gb: undefined,
        gc: null,
        gd: '',
        ge: [],
        gf: {}
      },
      h: {},
      i: {
        ia: undefined,
        ib: null,
        ic: {},
        id: {
          ida: undefined,
          idb: null,
          idc: {}
        }
      }
    };
    const predicate = (v, k, object, context) => {
      console.log(k);
      console.log(context.path);

      return !context.path.includes('/i/id');
    };

    const options = { recursive: true };
    const expected = {
      a: 'aa',
      b: undefined,
      c: null,
      d: '',
      e: [],
      f: {},
      g: {
        ga: 'ggaa',
        gb: undefined,
        gc: null,
        gd: '',
        ge: [],
        gf: {}
      },
      h: {},
      i: {
        ia: undefined,
        ib: null,
        ic: {},
        id: {}
      }
    };

    expect(filter(object, predicate, options)).to.deep.eql(expected);
  });

  it('filter by root - recursive', () => {
    const object = {
      a: 'aa',
      b: undefined,
      c: null,
      d: '',
      e: [],
      f: {},
      g: {
        ga: 'ggaa',
        gb: undefined,
        gc: null,
        gd: '',
        ge: [],
        gf: {}
      },
      h: {},
      i: {
        ia: undefined,
        ib: null,
        ic: {},
        id: {
          ida: undefined,
          idb: null,
          idc: {}
        }
      }
    };
    const predicate = (v, k, object, context) => {
      return context.root === object;
    };

    const options = { recursive: true };
    const expected = {
      a: 'aa',
      b: undefined,
      c: null,
      d: '',
      e: [],
      f: {},
      g: {}, // Clean sub objects
      h: {},
      i: {} // Clean sub objects
    };

    expect(filter(object, predicate, options)).to.deep.eql(expected);
  });

  it('filter by parent - recursive', () => {
    const object = {
      a: 'aa',
      b: undefined,
      c: null,
      d: '',
      e: [],
      f: {},
      g: {
        ga: 'ggaa',
        gb: undefined,
        gc: null,
        gd: '',
        ge: [],
        gf: {}
      },
      h: {},
      i: {
        ia: undefined,
        ib: null,
        ic: {},
        id: {
          ida: undefined,
          idb: null,
          idc: {}
        }
      }
    };
    const predicate = (v, k, object, context) => {
      // Includes level 1 and level 2
      return (
        context.parent.value === null || context.parent.value === context.root
      );
    };

    const options = { recursive: true };
    const expected = {
      a: 'aa',
      b: undefined,
      c: null,
      d: '',
      e: [],
      f: {},
      g: {
        ga: 'ggaa',
        gb: undefined,
        gc: null,
        gd: '',
        ge: [],
        gf: {}
      },
      h: {},
      i: {
        ia: undefined,
        ib: null,
        ic: {},
        id: {}
      }
    };

    expect(filter(object, predicate, options)).to.deep.eql(expected);
  });

  it('filter by level - recursive', () => {
    const object = {
      a: 'aa',
      b: undefined,
      c: null,
      d: '',
      e: [],
      f: {},
      g: {
        ga: 'ggaa',
        gb: undefined,
        gc: null,
        gd: '',
        ge: [],
        gf: {}
      },
      h: {},
      i: {
        ia: undefined,
        ib: null,
        ic: {},
        id: {
          ida: undefined,
          idb: null,
          idc: {}
        }
      }
    };
    const predicate = (v, k, object, context) => {
      // Includes level 1 and level 2
      return context.level === 1 || context.level === 2;
    };

    const options = { recursive: true };
    const expected = {
      a: 'aa',
      b: undefined,
      c: null,
      d: '',
      e: [],
      f: {},
      g: {
        ga: 'ggaa',
        gb: undefined,
        gc: null,
        gd: '',
        ge: [],
        gf: {}
      },
      h: {},
      i: {
        ia: undefined,
        ib: null,
        ic: {},
        id: {}
      }
    };

    expect(filter(object, predicate, options)).to.deep.eql(expected);
  });
});
