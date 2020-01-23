import { createTreeSkeleton } from './create-rest-tree';

export default class Apipie {
  constructor(records, options) {
    this.records = records;
    this.hooks = {
      beforeRequestHooks: [],
      afterRequestHooks: [],
    };
    this.meta = {};
    this.options = {};
    this.axios = options.axios;
  }

  globalHook(hook) {
    this.globalBeforeRequestHook(hook);
  }

  globalBeforeRequestHook(hook) {
    this.hooks.beforeRequestHooks.push(hook);
  }

  globalAfterRequestHook(hook) {
    this.hooks.afterRequestHooks.push(hook);
  }

  create() {
    return createTreeSkeleton(this.records, this);
  }
}
