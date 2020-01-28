import merge from 'deepmerge';

export default function normalizeRecord(record, { options = {}, meta = {}, hooks = [] }) {
  if (record._normalized) return record;
  transformSugarSyntax(record);
  stackUrl(options, record.options);

  const afterRequestHook = [];
  const afterRequestHooks = record.afterRequestHooks || [];
  const beforeRequestHook = [];
  const beforeRequestHooks = record.beforeRequestHooks || [];

  if (record.afterRequestHook && typeof record.afterRequestHook === 'function') {
    afterRequestHook.push(record.afterRequestHook);
  }

  if (record.beforeRequestHook && typeof record.beforeRequestHook === 'function') {
    beforeRequestHook.push(record.beforeRequestHook);
  }

  const recordBeforeRequestHooks = [].concat(hooks.beforeRequestHooks, beforeRequestHook, beforeRequestHooks);
  const recordAfterRequestHooks = [].concat(afterRequestHook, afterRequestHooks, hooks.afterRequestHooks);

  return {
    _normalized: true,
    _require: {
      data: !!record.data,
      params: !!record.params,
    },
    name: record.name,
    meta: merge(meta, record.meta || {}, { clone: true }),
    options: merge(options, record.options || {}, { clone: true }),
    hooks: {
      beforeRequestHooks: recordBeforeRequestHooks,
      afterRequestHooks: recordAfterRequestHooks,
    },
    children: record.children || [],
  };
}

export function transformSugarSyntax(record) {
  // { name, url, method } --> { name, option: { url, method } }
  if (record.options == null) record.options = {};
  if (record.url) {
    record.options.url = record.url;
  }
  if (record.url && record.method && (record.children == null)) {
    record.options.method = record.method;
  }
}

export function stackUrl(parentOpts, options) {
  // console.warn({parentOpts, options})
  if (parentOpts.url == null && options.url == null) return null;
  const { url } = options;
  const parentUrl = parentOpts.url;
  if ((url != null) && url.startsWith('/')) return url;
  if (parentUrl == null && !url.startsWith('/')) {
    throw new Error('Can not find root of path!');
  }
  if ((url == null || url === '') && parentUrl) return parentUrl;
  if (parentUrl.endsWith('/')) {
    options.url = parentUrl + url;
  } else {
    options.url = `${parentUrl}/${url}`;
  }
}
