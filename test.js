'use strict';

const {expect} = require('chai');
const filter = require('a-filter');

describe('a-filter', () => {
  it('should return null', () => {
    const obj = null;
    const predicate = v => v;
    const expected = null;

    expect(filter(obj, predicate)).to.deep.eql(expected);
  });

  it('should throw error', () => {
    const obj = {a: 'aa'};
    const predicate = ['not a function'];

    expect(() => filter(obj, predicate)).to.throw(TypeError);
  });

  it('should call Array.prototype.filter', () => {
    const obj = ['a', null, 'b', null];
    const predicate = v => v;

    expect(filter(obj, predicate)).to.deep.eql(obj.filter(predicate));
  });

  it('filter by key', () => {
    const obj = {
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

    expect(filter(obj, predicate)).to.deep.eql(expected);
  });

  it('filter by key - recursive', () => {
    const obj = {
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

    const options = {recursive: true};
    const expected = {
      a: 'aa',
      c: 'cc',
      d: {
        da: 'ddaa',
        dc: 'ddcc'
      }
    };

    expect(filter(obj, predicate, options)).to.deep.eql(expected);
  });

  it('filter by value', () => {
    const obj = {
      a: 'aa',
      b: 'bb',
      c: 'cc'
    };
    const predicate = v => {
      return v !== 'cc';
    };

    const expected = {
      a: 'aa',
      b: 'bb'
    };

    expect(filter(obj, predicate)).to.deep.eql(expected);
  });

  it('filter by value - recursive', () => {
    const obj = {
      a: 'aa',
      b: 'bb',
      c: 'cc',
      d: {
        da: 'ddaa',
        db: 'ddbb',
        dc: 'cc'
      }
    };
    const predicate = v => {
      return v !== 'cc';
    };

    const options = {recursive: true};
    const expected = {
      a: 'aa',
      b: 'bb',
      d: {
        da: 'ddaa',
        db: 'ddbb'
      }
    };

    expect(filter(obj, predicate, options)).to.deep.eql(expected);
  });

  it('filter empty', () => {
    const obj = {
      a: 'aa',
      b: undefined,
      c: null,
      d: '',
      e: [],
      f: {}
    };
    const predicate = v => Boolean(v);
    const expected = {
      a: 'aa',
      e: [],
      f: {}
    };

    expect(filter(obj, predicate)).to.deep.eql(expected);
  });

  it('filter empty(2)', () => {
    const obj = {
      a: 'aa',
      b: undefined,
      c: null,
      d: '',
      e: [],
      f: {}
    };
    const predicate = v => v;
    const expected = {
      a: 'aa',
      e: [],
      f: {}
    };

    expect(filter(obj, predicate)).to.deep.eql(expected);
  });

  it('filter null', () => {
    const obj = {
      a: 'aa',
      b: undefined,
      c: null,
      d: '',
      e: [],
      f: {}
    };
    const predicate = v => v != null; // eslint-disable-line no-eq-null,eqeqeq

    const expected = {
      a: 'aa',
      d: '',
      e: [],
      f: {}
    };

    expect(filter(obj, predicate)).to.deep.eql(expected);
  });

  it('filter null - recursive', () => {
    const obj = {
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
    const predicate = v => {
      return v != null; // eslint-disable-line no-eq-null,eqeqeq
    };

    const options = {recursive: true};
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

    expect(filter(obj, predicate, options)).to.deep.eql(expected);
  });

  it('filter null - recursive,filterArray', () => {
    const obj = {
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
    const predicate = v => {
      return v != null; // eslint-disable-line no-eq-null,eqeqeq
    };

    const options = {recursive: true, filterArray: true};
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

    expect(filter(obj, predicate, options)).to.deep.eql(expected);
  });

  it('filter null and empty objects - recursive', () => {
    const obj = {
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
    const predicate = v => {
      if (v == null) { // eslint-disable-line no-eq-null,eqeqeq
        return false;
      }

      if (typeof v === 'object' && !Array.isArray(v) && Object.keys(v).length === 0) {
        return false;
      }

      return true;
    };

    const options = {recursive: true};
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

    expect(filter(obj, predicate, options)).to.deep.eql(expected);
  });

  it('filter by path - recursive', () => {
    const obj = {
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
    const predicate = (v, k, obj, context) => {
      console.log(k);
      console.log(context.path);

      return !context.path.includes('/i/id');
    };

    const options = {recursive: true};
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
        id: {
        }
      }
    };

    expect(filter(obj, predicate, options)).to.deep.eql(expected);
  });

  it('filter by root - recursive', () => {
    const obj = {
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
    const predicate = (v, k, obj, context) => {
      return context.root === obj;
    };

    const options = {recursive: true};
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

    expect(filter(obj, predicate, options)).to.deep.eql(expected);
  });

  it('filter by parent - recursive', () => {
    const obj = {
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
    const predicate = (v, k, obj, context) => {
      // Includes level 1 and level 2
      return context.parent.value === null || context.parent.value === context.root;
    };

    const options = {recursive: true};
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

    expect(filter(obj, predicate, options)).to.deep.eql(expected);
  });

  it('filter by level - recursive', () => {
    const obj = {
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
    const predicate = (v, k, obj, context) => {
      // Includes level 1 and level 2
      return context.level === 1 || context.level === 2;
    };

    const options = {recursive: true};
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

    expect(filter(obj, predicate, options)).to.deep.eql(expected);
  });
});
