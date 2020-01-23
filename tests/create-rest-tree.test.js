import {
  createTreeSkeleton,
  addTreeBranch,
  calculateBranchNodes,
  createExecFunc,
} from '../lib/create-rest-tree';
import normalizeRecord from '../lib/normalizeRecord';

describe('Create REST Api routing', () => {
  describe('createExecFunc', () => {
    const axiosMock = () => Promise.resolve({ success: true });
    test('Basic', () => {
      const record = {
        _require: { data: false, params: false },
        name: 'test',
        options: [{}, {
          url: '/test/:id',
          timeout: 1000,
          headers: { 'X-Custom-Header': 'foobar' },
          method: 'GET',
        }],
        meta: [{}, { meta: true }],
        hooks: [],
        children: [],
      };
      const expectedCtx = {
        meta: { meta: true },
        options: {
          timeout: 1000,
          headers: { 'X-Custom-Header': 'foobar' },
          method: 'GET',
          url: '/test/1',
        },
        name: 'test',
        fullName: ['test'],
        response: { success: true },
      };
      const fn = createExecFunc(record, ['test'], axiosMock);
      return expect(fn({ url_params: { id: 1 } })).resolves.toEqual(expectedCtx);
    });
    test('With data and params', () => {
      const record = {
        _require: { data: false, params: false },
        name: 'test',
        options: [{}, {
          url: '/test/:id',
          timeout: 1000,
          headers: { 'X-Custom-Header': 'foobar' },
          method: 'GET',
        }],
        meta: { meta: true },
        hooks: [],
        children: [],
      };
      const expectedCtx = {
        meta: { meta: true },
        options: {
          timeout: 1000,
          headers: { 'X-Custom-Header': 'foobar' },
          method: 'GET',
          url: '/test/1',
          params: { abc: 'abc' },
          data: {
            data: 'some_data',
          },
        },
        name: 'test',
        fullName: ['test'],
        response: { success: true },
      };

      const fn = createExecFunc(record, ['test'], axiosMock);
      // fn({ url_params: {id: 1}, params: { abc: 'abc' }, data: { data: 'some_data' } })
      //   .then(ctx => { expect(ctx).toEqual(expectedCtx) })
      return expect(fn({ url_params: { id: 1 }, params: { abc: 'abc' }, data: { data: 'some_data' } }))
        .resolves.toEqual(expectedCtx);
    });
    describe('Copying of options, hooks and meta', () => {
      const props = {
        meta: [{ props: 'props', test: '123' }],
        options: [{ props: 'props' }],
        hooks: [(ctx, next) => { next(); }],
      };
      const record1 = {
        _normalized: true,
        _require: { data: false, params: false },
        name: 'test',
        meta: [props.meta[0], { test: 'test' }],
        options: [props.options[0], { test: 'test' }, { url: '/test/:id', method: 'get' }],
        hooks: [(ctx, next) => { next(); }, (ctx, next) => { next(); }],
        children: [],
      };
      const record2 = {
        _normalized: true,
        _require: { data: false, params: false },
        name: 'test',
        meta: [props.meta[0], { test: 'test' }],
        options: [props.options[0], { test: 'test' }, { url: '/test/:id', method: 'get' }],
        hooks: [(ctx, next) => { next(); }, (ctx, next) => { next(); }],
        children: [],
      };
      const expectedCtx = {
        meta: { props: 'props', test: 'test' },
        options: {
          test: 'test',
          props: 'props',
          method: 'get',
          url: '/test/1',
        },
        name: 'test',
        fullName: ['test'],
        response: { success: true },
      };
      const fn1 = createExecFunc(record1, ['test'], axiosMock);
      const fn2 = createExecFunc(record2, ['test'], axiosMock);

      props.meta[0].props = 'not_props';
      props.options[0].props = 'not_props';

      test('Immutable of meta, options of record1', () => expect(fn1({ url_params: { id: 1 } })).resolves.toEqual(expectedCtx));
      test('Immutable of meta, options of record2', () => expect(fn2({ url_params: { id: 1 } })).resolves.toEqual(expectedCtx));
      const record3 = {
        _normalized: true,
        _require: { data: false, params: false },
        name: 'test',
        meta: [props.meta[0], { test: 'test' }],
        options: [props.options[0], { test: 'test' }, { url: '/test/:id', method: 'get' }],
        hooks: [
          (ctx, next) => { next(); },
          (ctx, next) => {
            ctx.meta.props = 'not_props';
            ctx.options.props = 'not_props';
            next();
          },
        ],
        children: [],
      };
      const expectedCtx2 = {
        meta: { props: 'not_props', test: 'test' },
        options: {
          props: 'not_props',
          test: 'test',
          method: 'get',
          url: '/test/1',
        },
        name: 'test',
        fullName: ['test'],
        response: { success: true },
      };
      const fn3 = createExecFunc(record3, ['test'], axiosMock);
      test('Mutable meta, options of record3', () => expect(fn3({ url_params: { id: 1 } })).resolves.toEqual(expectedCtx2));
    });
    test('Base hook', () => {
      const hook = (ctx, next) => {
        ctx.meta.before = true;
        next();
        ctx.meta.after = true;
      };
      const record = {
        name: 'a', url: '/a', method: 'GET', hook,
      };
      const fn = createExecFunc(normalizeRecord(record, { meta: {}, options: {} }), ['a'], axiosMock);
      return expect(fn()).resolves.toMatchObject({ meta: { before: true, after: true } });
    });
    test('Async hook', () => {
      const hook = async (ctx, next) => {
        ctx.meta.before = true;
        await next();
        ctx.meta.after = true;
      };
      const record = {
        name: 'a', url: '/a', method: 'GET', hook,
      };
      const fn = createExecFunc(normalizeRecord(record, { meta: {}, options: {} }), ['a'], axiosMock);
      return expect(fn()).resolves.toMatchObject({ meta: { before: true, after: true } });
    });
    test('Composition of hook', () => {
      const hook1 = async (ctx, next) => {
        ctx.meta.test1 = true;
        ctx.meta.test2 = true;
        await next();
        ctx.meta.test2 = true;
      };
      const hook2 = async (ctx, next) => {
        ctx.meta.test1 = false;
        await next();
        ctx.meta.test2 = false;
      };
      const record = { name: 'a', url: '/a', method: 'GET' };
      const props = { hooks: [hook1, hook2], meta: {}, options: {} };
      const fn = createExecFunc(normalizeRecord(record, props), ['a'], axiosMock);
      return expect(fn()).resolves.toMatchObject({ meta: { test1: false, test2: true } });
    });
    describe('Test data, params and url_params validations', () => {
      const data = true;
      const params = true;
      const props = { meta: [], options: [], hooks: [] };
      describe('Test data validation', () => {
        test('Valid', () => {
          const record = {
            name: 'test', method: 'get', url: '/test', data,
          };
          const expectedCtx = {
            meta: {},
            options: {
              data: 'test_data',
              method: 'get',
              url: '/test',
            },
            name: 'test',
            fullName: ['test'],
            response: { success: true },
          };
          const normalizedRecord = normalizeRecord(record, props);
          const fn = createExecFunc(normalizedRecord, ['test'], axiosMock);
          return expect(fn({ data: 'test_data' })).resolves.toEqual(expectedCtx);
        });
        test('Invalid', () => {
          const record = {
            name: 'test', method: 'get', url: '/test', data,
          };
          const normalizedRecord = normalizeRecord(record, props);
          const fn = createExecFunc(normalizedRecord, ['test'], axiosMock);
          try {
            expect.assertions(1);
            fn();
          } catch (err) {
            expect(err.message).toEqual('Require data!');
          }
        });
      });
      describe('Test params validation', () => {
        test('Valid', () => {
          const record = {
            name: 'test', method: 'get', url: '/test', params,
          };
          const expectedCtx = {
            meta: {},
            options: {
              params: { test: 'test_param' },
              method: 'get',
              url: '/test',
            },
            name: 'test',
            fullName: ['test'],
            response: { success: true },
          };
          const normalizedRecord = normalizeRecord(record, props);
          const fn = createExecFunc(normalizedRecord, ['test'], axiosMock);
          return expect(fn({ params: { test: 'test_param' } })).resolves.toEqual(expectedCtx);
        });
        test('Invalid', () => {
          const record = {
            name: 'test', method: 'get', url: '/test', params,
          };
          const normalizedRecord = normalizeRecord(record, props);
          const fn = createExecFunc(normalizedRecord, ['test'], axiosMock);
          try {
            expect.assertions(1);
            fn();
          } catch (err) {
            expect(err.message).toEqual('Require params!');
          }
        });
      });
      describe('Test url_params validation', () => {
        test('Valid', () => {
          const record = { name: 'test', method: 'get', url: '/test/:id1/:id2' };
          const normalizedRecord = normalizeRecord(record, props);
          const fn = createExecFunc(normalizedRecord, ['test'], axiosMock);
          const url_params = { url_params: { id1: 1, id2: 2 } };
          return expect(fn(url_params)).resolves.toHaveProperty('options.url', '/test/1/2');
        });
        test('Invalid all params', () => {
          const record = { name: 'test', method: 'get', url: '/test/:id1/:id2' };
          const normalizedRecord = normalizeRecord(record, props);
          const fn = createExecFunc(normalizedRecord, ['test'], axiosMock);
          try {
            expect.assertions(1);
            fn();
          } catch (err) {
            expect(err.message).toEqual('Require url_params!');
          }
        });
        test('Invalid with part of url_params', () => {
          const record = { name: 'test', method: 'get', url: '/test/:id1/:id2' };
          const normalizedRecord = normalizeRecord(record, props);
          const fn = createExecFunc(normalizedRecord, ['test'], axiosMock);
          try {
            expect.assertions(1);
            fn({ url_params: { id1: 1 } });
          } catch (err) {
            expect(err.message).toEqual('Require id1, id2, but given id1');
          }
        });
        describe('Optional names params', () => {
          test('Without optional names params', () => {
            const record = { name: 'test', method: 'get', url: '/test/:id1/:id2/:id3?' };
            const normalizedRecord = normalizeRecord(record, props);
            const fn = createExecFunc(normalizedRecord, ['test'], axiosMock);
            const url_params = { url_params: { id1: 1, id2: 2 } };
            return expect(fn(url_params)).resolves.toHaveProperty('options.url', '/test/1/2');
          });
          test('With optional names params', () => {
            const record = { name: 'test', method: 'get', url: '/test/:id1/:id2/:id3?' };
            const normalizedRecord = normalizeRecord(record, props);
            const fn = createExecFunc(normalizedRecord, ['test'], axiosMock);
            const url_params = { url_params: { id1: 1, id2: 2, id3: 3 } };
            return expect(fn(url_params)).resolves.toHaveProperty('options.url', '/test/1/2/3');
          });
        });
      });
    });
  });
  describe('calculateBranchNodes', () => {
    test('Basic', () => {
      const records = [{
        name: 'test',
        url: '/test',
        method: 'get',
        children: [
          { name: 'test1', url: '/test/1', method: 'get' },
          { name: 'test2', url: '/test/2', method: 'get' },
        ],
      }];
      const expectedRecord = {
        _normalized: true,
        _require: { data: false, params: false },
        name: 'test1',
        meta: {},
        options: { url: '/test/1', method: 'get' },
        hooks: [],
        children: [],
      };
      const acc = { meta: {}, options: {}, hooks: [] };
      const path = [0, 0];
      const [names, record] = calculateBranchNodes(records, path, [], acc);
      expect(names).toEqual(['test', 'test1']);
      expect(record).toEqual(expectedRecord);
    });
    test('With meta, options', () => {
      const acc = {
        meta: { acc: 'acc' },
        options: { acc: 'acc' },
        hooks: [],
      };
      const records = [{
        name: 'test',
        url: '/test',
        method: 'get',
        meta: { test: 'test' },
        options: { test: 'test' },
        children: [
          {
            name: 'test1',
            url: '/test/1',
            method: 'get',
            meta: { test1: 'test1' },
            options: { test1: 'test1' },
          },
          { name: 'test2', url: '/test/2', method: 'get' },
        ],
      }];
      const path = [0, 0];
      const expectedRecord = {
        _normalized: true,
        _require: { data: false, params: false },
        name: 'test1',
        meta: { acc: 'acc', test: 'test', test1: 'test1' },
        options: {
          acc: 'acc', test: 'test', test1: 'test1', url: '/test/1', method: 'get',
        },
        hooks: [],
        children: [],
      };
      const [names, record] = calculateBranchNodes(records, path, [], acc);
      expect(names).toEqual(['test', 'test1']);
      expect(record).toEqual(expectedRecord);
    });
  });
  describe('addTreeBranch', () => {
    const axiosMock = () => Promise.resolve({ success: true });
    describe('Basic', () => {
      const records = [{
        name: 'test',
        url: '/test',
        method: 'get',
        children: [
          { name: 'test1', url: '/test/1', method: 'get' },
          { name: 'test2', url: 'test/2', method: 'get' },
        ],
      }];
      const tree = {};
      const acc = {
        meta: [], options: [], hooks: [], axios: axiosMock, tree, records,
      };
      const path = [0];
      const record = records[0];
      addTreeBranch(tree, record, path, acc);
      test('Tree properties', () => {
        expect(tree).toHaveProperty('test');
        expect(tree).toHaveProperty('test.get');
        expect(tree).toHaveProperty('test.test1');
        expect(tree).toHaveProperty('test.test2');
      });
      test('Leafs of tree is a Function', () => {
        expect(tree.test.get).toBeInstanceOf(Function);
        expect(tree.test.test1).toBeInstanceOf(Function);
        expect(tree.test.test2).toBeInstanceOf(Function);
      });
      test('Execution of leaf', () => {
        const expectedCtx = {
          meta: {},
          options: { method: 'get', url: '/test' },
          response: { success: true },
          name: 'get',
          fullName: ['test', 'get'],
        };
        const fn = tree.test.get;
        return expect(fn()).resolves.toEqual(expectedCtx);
      });
      test('Test', () => {
        const expectedCtx = {
          meta: {},
          options: { method: 'get', url: '/test/1' },
          response: { success: true },
          name: 'test1',
          fullName: ['test', 'test1'],
        };
        const fn = tree.test.test1;
        return expect(fn()).resolves.toEqual(expectedCtx);
      });
      test('Stack urls', () => {
        const expectedCtx = {
          meta: {},
          options: { method: 'get', url: '/test/test/2' },
          response: { success: true },
          name: 'test2',
          fullName: ['test', 'test2'],
        };
        const fn = tree.test.test2;
        return expect(fn()).resolves.toEqual(expectedCtx);
      });
    });
    describe('Full path stacking', () => {
      const records = [{
        name: 'root',
        url: '/',
        children: [
          { name: 'test1', url: '/test/1', method: 'get' },
          { name: 'test2', url: 'test/2', method: 'get' },
          {
            name: 'test3',
            children: [
              { name: 'test4', url: 'test/4', method: 'get' },
              { name: 'test5', url: ':id/5', method: 'get' },
              { name: 'test6', url: '/:id/6', method: 'get' },
            ],
          },
        ],
      }];
      const tree = {};
      const acc = {
        meta: {}, options: {}, hooks: [], axios: axiosMock, tree, records,
      };
      const path = [0];
      const record = records[0];
      addTreeBranch(tree, record, path, acc);
      test('Basic', () => {
        const fn = tree.root.test1;
        return expect(fn()).resolves.toHaveProperty('options.url', '/test/1');
      });
      test('Basic stack', () => {
        const fn = tree.root.test2;
        return expect(fn()).resolves.toHaveProperty('options.url', '/test/2');
      });
      test('Stack path', () => {
        const fn = tree.root.test3.test4;
        return expect(fn()).resolves.toHaveProperty('options.url', '/test/4');
      });
      test('Stack path with url_param', () => {
        const fn = tree.root.test3.test5;
        return expect(fn({ url_params: { id: 't' } })).resolves.toHaveProperty('options.url', '/t/5');
      });
      test('Path with url_param', () => {
        const fn = tree.root.test3.test6;
        return expect(fn({ url_params: { id: 't' } })).resolves.toHaveProperty('options.url', '/t/6');
      });
    });
  });
  describe('createTreeSkeleton', () => {
    const axiosMock = () => Promise.resolve({ success: true });
    test('Basic', () => {
      const records = [{
        name: 'test',
        url: '/test',
        method: 'get',
        children: [
          { name: 'test1', url: '/test/1', method: 'get' },
          { name: 'test2', url: '/test/2', method: 'get' },
        ],
      }];
      const acc = {
        meta: [], options: [], hooks: [], axios: axiosMock, records,
      };
      const tree = createTreeSkeleton(records, acc);
      expect(tree).toHaveProperty('test');
      expect(tree).toHaveProperty('test.get');
      expect(tree).toHaveProperty('test.test1');
      expect(tree).toHaveProperty('test.test2');
    });
    describe('Test named parameters', () => {
      const records = [
        { name: 'test', method: 'get', url: '/test/:id' },
      ];
      const acc = {
        meta: {}, options: {}, hooks: [], axios: axiosMock, records,
      };
      const tree = createTreeSkeleton(records, acc);
      test('with id=1', () => {
        const expectedCtx = {
          meta: {},
          options: {
            method: 'get',
            url: '/test/1',
          },
          name: 'test',
          fullName: ['test'],
          response: { success: true },
        };
        return expect(tree.test({ url_params: { id: 1 } })).resolves.toEqual(expectedCtx);
      });
      test('with id=2 and with same request', () => {
        const expectedCtx = {
          meta: {},
          options: {
            method: 'get',
            url: '/test/2',
          },
          name: 'test',
          fullName: ['test'],
          response: { success: true },
        };
        return expect(tree.test({ url_params: { id: 2 } })).resolves.toEqual(expectedCtx);
      });
    });
  });
});
