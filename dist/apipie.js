var apipie=function(){"use strict";var e=function(e){return function(e){return!!e&&"object"==typeof e}(e)&&!function(e){var t=Object.prototype.toString.call(e);return"[object RegExp]"===t||"[object Date]"===t||function(e){return e.$$typeof===r}(e)}(e)};var r="function"==typeof Symbol&&Symbol.for?Symbol.for("react.element"):60103;function t(r,t){var n;return t&&!0===t.clone&&e(r)?o((n=r,Array.isArray(n)?[]:{}),r,t):r}function n(r,n,i){var a=r.slice();return n.forEach(function(n,u){void 0===a[u]?a[u]=t(n,i):e(n)?a[u]=o(r[u],n,i):-1===r.indexOf(n)&&a.push(t(n,i))}),a}function o(r,i,a){var u=Array.isArray(i);return u===Array.isArray(r)?u?((a||{arrayMerge:n}).arrayMerge||n)(r,i,a):function(r,n,i){var a={};return e(r)&&Object.keys(r).forEach(function(e){a[e]=t(r[e],i)}),Object.keys(n).forEach(function(u){e(n[u])&&r[u]?a[u]=o(r[u],n[u],i):a[u]=t(n[u],i)}),a}(r,i,a):t(i,a)}o.all=function(e,r){if(!Array.isArray(e)||e.length<2)throw new Error("first argument should be an array with at least two elements");return e.reduce(function(e,t){return o(e,t,r)})};var i=o,a=Array.isArray||function(e){return"[object Array]"==Object.prototype.toString.call(e)},u=w,s=h,f=function(e,r){return d(h(e,r),r)},c=d,l=b,p=new RegExp(["(\\\\.)","([\\/.])?(?:(?:\\:(\\w+)(?:\\(((?:\\\\.|[^\\\\()])+)\\))?|\\(((?:\\\\.|[^\\\\()])+)\\))([+*?])?|(\\*))"].join("|"),"g");function h(e,r){for(var t,n=[],o=0,i=0,a="",u=r&&r.delimiter||"/";null!=(t=p.exec(e));){var s=t[0],f=t[1],c=t.index;if(a+=e.slice(i,c),i=c+s.length,f)a+=f[1];else{var l=e[i],h=t[2],m=t[3],d=t[4],g=t[5],k=t[6],b=t[7];a&&(n.push(a),a="");var w=null!=h&&null!=l&&l!==h,R="+"===k||"*"===k,E="?"===k||"*"===k,q=t[2]||u,x=d||g;n.push({name:m||o++,prefix:h||"",delimiter:q,optional:E,repeat:R,partial:w,asterisk:!!b,pattern:x?y(x):b?".*":"[^"+v(q)+"]+?"})}}return i<e.length&&(a+=e.substr(i)),a&&n.push(a),n}function m(e){return encodeURI(e).replace(/[\/?#]/g,function(e){return"%"+e.charCodeAt(0).toString(16).toUpperCase()})}function d(e,r){for(var t=new Array(e.length),n=0;n<e.length;n++)"object"==typeof e[n]&&(t[n]=new RegExp("^(?:"+e[n].pattern+")$",k(r)));return function(r,n){for(var o="",i=r||{},u=(n||{}).pretty?m:encodeURIComponent,s=0;s<e.length;s++){var f=e[s];if("string"!=typeof f){var c,l=i[f.name];if(null==l){if(f.optional){f.partial&&(o+=f.prefix);continue}throw new TypeError('Expected "'+f.name+'" to be defined')}if(a(l)){if(!f.repeat)throw new TypeError('Expected "'+f.name+'" to not repeat, but received `'+JSON.stringify(l)+"`");if(0===l.length){if(f.optional)continue;throw new TypeError('Expected "'+f.name+'" to not be empty')}for(var p=0;p<l.length;p++){if(c=u(l[p]),!t[s].test(c))throw new TypeError('Expected all "'+f.name+'" to match "'+f.pattern+'", but received `'+JSON.stringify(c)+"`");o+=(0===p?f.prefix:f.delimiter)+c}}else{if(c=f.asterisk?encodeURI(l).replace(/[?#]/g,function(e){return"%"+e.charCodeAt(0).toString(16).toUpperCase()}):u(l),!t[s].test(c))throw new TypeError('Expected "'+f.name+'" to match "'+f.pattern+'", but received "'+c+'"');o+=f.prefix+c}}else o+=f}return o}}function v(e){return e.replace(/([.+*?=^!:${}()[\]|\/\\])/g,"\\$1")}function y(e){return e.replace(/([=!:$\/()])/g,"\\$1")}function g(e,r){return e.keys=r,e}function k(e){return e&&e.sensitive?"":"i"}function b(e,r,t){a(r)||(t=r||t,r=[]);for(var n=(t=t||{}).strict,o=!1!==t.end,i="",u=0;u<e.length;u++){var s=e[u];if("string"==typeof s)i+=v(s);else{var f=v(s.prefix),c="(?:"+s.pattern+")";r.push(s),s.repeat&&(c+="(?:"+f+c+")*"),i+=c=s.optional?s.partial?f+"("+c+")?":"(?:"+f+"("+c+"))?":f+"("+c+")"}}var l=v(t.delimiter||"/"),p=i.slice(-l.length)===l;return n||(i=(p?i.slice(0,-l.length):i)+"(?:"+l+"(?=$))?"),i+=o?"$":n&&p?"":"(?="+l+"|$)",g(new RegExp("^"+i,k(t)),r)}function w(e,r,t){return a(r)||(t=r||t,r=[]),t=t||{},e instanceof RegExp?function(e,r){var t=e.source.match(/\((?!\?)/g);if(t)for(var n=0;n<t.length;n++)r.push({name:n,prefix:null,delimiter:null,optional:!1,repeat:!1,partial:!1,asterisk:!1,pattern:null});return g(e,r)}(e,r):a(e)?function(e,r,t){for(var n=[],o=0;o<e.length;o++)n.push(w(e[o],r,t).source);return g(new RegExp("(?:"+n.join("|")+")",k(t)),r)}(e,r,t):function(e,r,t){return b(h(e,t),r,t)}(e,r,t)}function R(e,r){var t=r.options;void 0===t&&(t={});var n=r.meta;void 0===n&&(n={});var o=r.hooks;if(void 0===o&&(o=[]),e._normalized)return e;!function(e){null==e.options&&(e.options={});e.url&&(e.options.url=e.url);e.url&&e.method&&null==e.children&&(e.options.method=e.method)}(e),function(e,r){if(null==e.url&&null==r.url)return null;var t=r.url,n=e.url;if(null!=t&&t.startsWith("/"))return t;if(null==n&&!t.startsWith("/"))throw new Error("Can not find root of path!");if((null==t||""===t)&&n)return n;n.endsWith("/")?r.url=n+t:r.url=n+"/"+t}(t,e.options);var a=[],u=e.afterRequestHooks||[],s=[],f=e.beforeRequestHooks||[];e.afterRequestHook&&"function"==typeof e.afterRequestHook&&a.push(e.afterRequestHook),e.beforeRequestHook&&"function"==typeof e.beforeRequestHook&&s.push(e.beforeRequestHook);var c=[].concat(o.beforeRequestHooks,s,f),l=[].concat(a,u,o.afterRequestHooks);return{_normalized:!0,_require:{data:!!e.data,params:!!e.params},name:e.name,meta:i(n,e.meta||{},{clone:!0}),options:i(t,e.options||{},{clone:!0}),hooks:{beforeRequestHooks:c,afterRequestHooks:l},children:e.children||[]}}function E(e,r){var t={};r.tree=t;var n=r;return e.forEach(function(e,r){return function e(r,t,n,o){r[t.name]={};if(t.children&&t.children.length)return t.method&&t.children.push({name:t.method,method:t.method,url:t.url,data:!!t.data,params:!!t.params}),void t.children.forEach(function(i,a){return e(r[t.name],i,n.concat(a),o)});r[t.name]=function(e,r){return function(t){var n=r.tree,o=r.records,a=r.axios,s=function e(r,t,n,o){var i=t.shift();r[i]=R(r[i],o);var a=r[i];n.push(a.name);if(a.children.length)return e(a.children,t,n,a);return[n,a]}(o,e,[],r),f=s[0],c=s[1];return function(e,r,t){r.reduce(function(e,n,o){return o===r.length-1?e[n]=t:e[n]},e)}(n,f,function(e,r,t){e.options instanceof Array&&(e.options=i.all(e.options));e.meta instanceof Array&&(e.meta=i.all(e.meta));var n=function(e){if(!Array.isArray(e))throw new TypeError("Hooks stack must be an array!");return e.forEach(function(e){if("function"!=typeof e)throw new TypeError("Hooks must be composed of functions!")}),function(r,t){var n=-1;return function o(i){if(i<=n)return Promise.reject(new Error("next() called multiple times"));n=i;var a=e[i];if(i===e.length&&(a=t),!a)return Promise.resolve();try{return Promise.resolve(a(r,function(){return o(i+1)}))}catch(e){return Promise.reject(e)}}(0)}}([].concat(e.hooks.beforeRequestHooks,[function(e,r){return t(e.options).then(function(t){return e.response=t,r()})}],e.hooks.afterRequestHooks));return function(t){void 0===t&&(t={});var o=i(e.options,function(e,r,t){var n=t._require,o={url:e};if(n.params&&(!r||!r.params))throw new Error("Require params!");if(n.data&&(!r||!r.data))throw new Error("Require data!");var i=u.parse(e).filter(function(e){return["string"!=typeof e,!e.optional,!e.asterisk].every(Boolean)}).map(function(e){return e.name});if(i.length&&!r)throw new Error("Require url_params!");if(!r)return o;var a=r.url_params,s=r.params,f=r.data,c=r.options;if(a){i.forEach(function(e){if(!a[e])throw new Error("Require "+i.join(", ")+", but given "+(Object.keys(a).join(", ")||"nothing"))});var l=u.compile(e);o.url=l(a)}return s&&(o.params=s),f&&(o.data=f),c&&Object.assign(o,c),o}(e.options.url,t,e),{clone:!0}),a={meta:Object.assign({},e.meta,{url_params:t.url_params},t.meta),options:o,response:null,name:e.name,fullName:r};return n(a).then(function(){return a})}}(c,f,a)),function(e,r){return r.reduce(function(e,r){return e[r]},e)}(n,f)(t)}}(n,o)}(t,e,[r],n)}),t}u.parse=s,u.compile=f,u.tokensToFunction=c,u.tokensToRegExp=l;var q=function(e,r){this.records=e,this.hooks={beforeRequestHooks:[],afterRequestHooks:[]},this.meta={},this.options={},this.axios=r.axios};return q.prototype.globalHook=function(e){this.globalBeforeRequestHook(e)},q.prototype.globalBeforeRequestHook=function(e){this.hooks.beforeRequestHooks.push(e)},q.prototype.globalAfterRequestHook=function(e){this.hooks.afterRequestHooks.push(e)},q.prototype.create=function(){return E(this.records,this)},q}();
