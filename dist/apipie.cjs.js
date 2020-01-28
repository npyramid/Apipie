"use strict";var isMergeableObject=function(e){return isNonNullObject(e)&&!isSpecial(e)};function isNonNullObject(e){return!!e&&"object"==typeof e}function isSpecial(e){var r=Object.prototype.toString.call(e);return"[object RegExp]"===r||"[object Date]"===r||isReactElement(e)}var canUseSymbol="function"==typeof Symbol&&Symbol.for,REACT_ELEMENT_TYPE=canUseSymbol?Symbol.for("react.element"):60103;function isReactElement(e){return e.$$typeof===REACT_ELEMENT_TYPE}function emptyTarget(e){return Array.isArray(e)?[]:{}}function cloneIfNecessary(e,r){return r&&!0===r.clone&&isMergeableObject(e)?deepmerge(emptyTarget(e),e,r):e}function defaultArrayMerge(e,r,t){var n=e.slice();return r.forEach(function(r,o){void 0===n[o]?n[o]=cloneIfNecessary(r,t):isMergeableObject(r)?n[o]=deepmerge(e[o],r,t):-1===e.indexOf(r)&&n.push(cloneIfNecessary(r,t))}),n}function mergeObject(e,r,t){var n={};return isMergeableObject(e)&&Object.keys(e).forEach(function(r){n[r]=cloneIfNecessary(e[r],t)}),Object.keys(r).forEach(function(o){isMergeableObject(r[o])&&e[o]?n[o]=deepmerge(e[o],r[o],t):n[o]=cloneIfNecessary(r[o],t)}),n}function deepmerge(e,r,t){var n=Array.isArray(r);return n===Array.isArray(e)?n?((t||{arrayMerge:defaultArrayMerge}).arrayMerge||defaultArrayMerge)(e,r,t):mergeObject(e,r,t):cloneIfNecessary(r,t)}deepmerge.all=function(e,r){if(!Array.isArray(e)||e.length<2)throw new Error("first argument should be an array with at least two elements");return e.reduce(function(e,t){return deepmerge(e,t,r)})};var deepmerge_1=deepmerge,isarray=Array.isArray||function(e){return"[object Array]"==Object.prototype.toString.call(e)},pathToRegexp_1=pathToRegexp,parse_1=parse,compile_1=compile,tokensToFunction_1=tokensToFunction,tokensToRegExp_1=tokensToRegExp,PATH_REGEXP=new RegExp(["(\\\\.)","([\\/.])?(?:(?:\\:(\\w+)(?:\\(((?:\\\\.|[^\\\\()])+)\\))?|\\(((?:\\\\.|[^\\\\()])+)\\))([+*?])?|(\\*))"].join("|"),"g");function parse(e,r){for(var t,n=[],o=0,a=0,i="",s=r&&r.delimiter||"/";null!=(t=PATH_REGEXP.exec(e));){var u=t[0],c=t[1],p=t.index;if(i+=e.slice(a,p),a=p+u.length,c)i+=c[1];else{var l=e[a],f=t[2],h=t[3],g=t[4],m=t[5],d=t[6],y=t[7];i&&(n.push(i),i="");var R=null!=f&&null!=l&&l!==f,k="+"===d||"*"===d,E="?"===d||"*"===d,v=t[2]||s,x=g||m;n.push({name:h||o++,prefix:f||"",delimiter:v,optional:E,repeat:k,partial:R,asterisk:!!y,pattern:x?escapeGroup(x):y?".*":"[^"+escapeString(v)+"]+?"})}}return a<e.length&&(i+=e.substr(a)),i&&n.push(i),n}function compile(e,r){return tokensToFunction(parse(e,r),r)}function encodeURIComponentPretty(e){return encodeURI(e).replace(/[\/?#]/g,function(e){return"%"+e.charCodeAt(0).toString(16).toUpperCase()})}function encodeAsterisk(e){return encodeURI(e).replace(/[?#]/g,function(e){return"%"+e.charCodeAt(0).toString(16).toUpperCase()})}function tokensToFunction(e,r){for(var t=new Array(e.length),n=0;n<e.length;n++)"object"==typeof e[n]&&(t[n]=new RegExp("^(?:"+e[n].pattern+")$",flags(r)));return function(r,n){for(var o="",a=r||{},i=(n||{}).pretty?encodeURIComponentPretty:encodeURIComponent,s=0;s<e.length;s++){var u=e[s];if("string"!=typeof u){var c,p=a[u.name];if(null==p){if(u.optional){u.partial&&(o+=u.prefix);continue}throw new TypeError('Expected "'+u.name+'" to be defined')}if(isarray(p)){if(!u.repeat)throw new TypeError('Expected "'+u.name+'" to not repeat, but received `'+JSON.stringify(p)+"`");if(0===p.length){if(u.optional)continue;throw new TypeError('Expected "'+u.name+'" to not be empty')}for(var l=0;l<p.length;l++){if(c=i(p[l]),!t[s].test(c))throw new TypeError('Expected all "'+u.name+'" to match "'+u.pattern+'", but received `'+JSON.stringify(c)+"`");o+=(0===l?u.prefix:u.delimiter)+c}}else{if(c=u.asterisk?encodeAsterisk(p):i(p),!t[s].test(c))throw new TypeError('Expected "'+u.name+'" to match "'+u.pattern+'", but received "'+c+'"');o+=u.prefix+c}}else o+=u}return o}}function escapeString(e){return e.replace(/([.+*?=^!:${}()[\]|\/\\])/g,"\\$1")}function escapeGroup(e){return e.replace(/([=!:$\/()])/g,"\\$1")}function attachKeys(e,r){return e.keys=r,e}function flags(e){return e&&e.sensitive?"":"i"}function regexpToRegexp(e,r){var t=e.source.match(/\((?!\?)/g);if(t)for(var n=0;n<t.length;n++)r.push({name:n,prefix:null,delimiter:null,optional:!1,repeat:!1,partial:!1,asterisk:!1,pattern:null});return attachKeys(e,r)}function arrayToRegexp(e,r,t){for(var n=[],o=0;o<e.length;o++)n.push(pathToRegexp(e[o],r,t).source);return attachKeys(new RegExp("(?:"+n.join("|")+")",flags(t)),r)}function stringToRegexp(e,r,t){return tokensToRegExp(parse(e,t),r,t)}function tokensToRegExp(e,r,t){isarray(r)||(t=r||t,r=[]);for(var n=(t=t||{}).strict,o=!1!==t.end,a="",i=0;i<e.length;i++){var s=e[i];if("string"==typeof s)a+=escapeString(s);else{var u=escapeString(s.prefix),c="(?:"+s.pattern+")";r.push(s),s.repeat&&(c+="(?:"+u+c+")*"),a+=c=s.optional?s.partial?u+"("+c+")?":"(?:"+u+"("+c+"))?":u+"("+c+")"}}var p=escapeString(t.delimiter||"/"),l=a.slice(-p.length)===p;return n||(a=(l?a.slice(0,-p.length):a)+"(?:"+p+"(?=$))?"),a+=o?"$":n&&l?"":"(?="+p+"|$)",attachKeys(new RegExp("^"+a,flags(t)),r)}function pathToRegexp(e,r,t){return isarray(r)||(t=r||t,r=[]),t=t||{},e instanceof RegExp?regexpToRegexp(e,r):isarray(e)?arrayToRegexp(e,r,t):stringToRegexp(e,r,t)}function parseExecArgs(e,r,t){var n=t._require,o={url:e};if(n.params&&(!r||!r.params))throw new Error("Require params!");if(n.data&&(!r||!r.data))throw new Error("Require data!");var a=pathToRegexp_1.parse(e).filter(function(e){return["string"!=typeof e,!e.optional,!e.asterisk].every(Boolean)}).map(function(e){return e.name});if(a.length&&!r)throw new Error("Require url_params!");if(!r)return o;var i=r.url_params,s=r.params,u=r.data;if(i){a.forEach(function(e){if(!i[e])throw new Error("Require "+a.join(", ")+", but given "+(Object.keys(i).join(", ")||"nothing"))});var c=pathToRegexp_1.compile(e);o.url=c(i)}return s&&(o.params=s),u&&(o.data=u),o}function normalizeRecord(e,r){var t=r.options;void 0===t&&(t={});var n=r.meta;void 0===n&&(n={});var o=r.hooks;if(void 0===o&&(o=[]),e._normalized)return e;transformSugarSyntax(e),stackUrl(t,e.options);var a=[],i=e.afterRequestHooks||[],s=[],u=e.beforeRequestHooks||[];e.afterRequestHook&&"function"==typeof e.afterRequestHook&&a.push(e.afterRequestHook),e.beforeRequestHook&&"function"==typeof e.beforeRequestHook&&s.push(e.beforeRequestHook);var c=[].concat(o.beforeRequestHooks,s,u),p=[].concat(o.afterRequestHooks,a,i);return{_normalized:!0,_require:{data:!!e.data,params:!!e.params},name:e.name,meta:deepmerge_1(n,e.meta||{},{clone:!0}),options:deepmerge_1(t,e.options||{},{clone:!0}),hooks:{beforeRequestHooks:c,afterRequestHooks:p},children:e.children||[]}}function transformSugarSyntax(e){null==e.options&&(e.options={}),e.url&&(e.options.url=e.url),e.url&&e.method&&null==e.children&&(e.options.method=e.method)}function stackUrl(e,r){if(null==e.url&&null==r.url)return null;var t=r.url,n=e.url;if(null!=t&&t.startsWith("/"))return t;if(null==n&&!t.startsWith("/"))throw new Error("Can not find root of path!");if((null==t||""===t)&&n)return n;n.endsWith("/")?r.url=n+t:r.url=n+"/"+t}function compose(e){if(!Array.isArray(e))throw new TypeError("Hooks stack must be an array!");return e.forEach(function(e){if("function"!=typeof e)throw new TypeError("Hooks must be composed of functions!")}),function(r,t){var n=-1;return function o(a){if(a<=n)return Promise.reject(new Error("next() called multiple times"));n=a;var i=e[a];a===e.length&&(i=t);if(!i)return Promise.resolve();return i(r,function(){return o(a+1)})}(0)}}function setVal(e,r,t){r.reduce(function(e,n,o){return o===r.length-1?e[n]=t:e[n]},e)}function getVal(e,r){return r.reduce(function(e,r){return e[r]},e)}function createTreeSkeleton(e,r){var t={};r.tree=t;var n=r;return e.forEach(function(e,r){return addTreeBranch(t,e,[r],n)}),t}function addTreeBranch(e,r,t,n){if(e[r.name]={},r.children&&r.children.length)return r.method&&r.children.push({name:r.method,method:r.method,url:r.url,data:!!r.data,params:!!r.params}),void r.children.forEach(function(o,a){return addTreeBranch(e[r.name],o,t.concat(a),n)});e[r.name]=lazyCalcLeafNode(t,n)}function lazyCalcLeafNode(e,r){return function(t){var n=r.tree,o=r.records,a=r.axios,i=calculateBranchNodes(o,e,[],r),s=i[0];return setVal(n,s,createExecFunc(i[1],s,a)),getVal(n,s)(t)}}function calculateBranchNodes(e,r,t,n){var o=r.shift();e[o]=normalizeRecord(e[o],n);var a=e[o];return t.push(a.name),a.children.length?calculateBranchNodes(a.children,r,t,a):[t,a]}function createExecFunc(e,r,t){e.options instanceof Array&&(e.options=deepmerge_1.all(e.options)),e.meta instanceof Array&&(e.meta=deepmerge_1.all(e.meta));var n=compose([].concat(e.hooks.beforeRequestHooks,[function(e,r){return t(e.options).then(function(t){return e.response=t,r()})}],e.hooks.afterRequestHooks));return function(t){void 0===t&&(t={});var o=deepmerge_1(e.options,parseExecArgs(e.options.url,t,e),{clone:!0}),a={meta:Object.assign({},e.meta,{url_params:t.url_params}),options:o,response:null,name:e.name,fullName:r};return n(a).then(function(){return a})}}pathToRegexp_1.parse=parse_1,pathToRegexp_1.compile=compile_1,pathToRegexp_1.tokensToFunction=tokensToFunction_1,pathToRegexp_1.tokensToRegExp=tokensToRegExp_1;var Apipie=function(e,r){this.records=e,this.hooks={beforeRequestHooks:[],afterRequestHooks:[]},this.meta={},this.options={},this.axios=r.axios};Apipie.prototype.globalHook=function(e){this.globalBeforeRequestHook(e)},Apipie.prototype.globalBeforeRequestHook=function(e){this.hooks.beforeRequestHooks.push(e)},Apipie.prototype.globalAfterRequestHook=function(e){this.hooks.afterRequestHooks.push(e)},Apipie.prototype.create=function(){return createTreeSkeleton(this.records,this)},module.exports=Apipie;
