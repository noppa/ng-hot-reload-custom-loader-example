/* eslint-env node */
const loaderUtils = require('loader-utils');
const corePath = require.resolve('ng-hot-reload-core');
const sourceMap = require('source-map');

// Tests that we don't modify our own library files, i.e. files that are in
// ng-hot-reload/packages or one of the suffixed ng-hot-reload-* directories.
const noTransform =
  /(?:hot-loader|ng-hot-reload(?:[\\/]packages[\\/]|-)(?:core|loader|standalone))/;

const codeWrapperTop = ({ corePath, forceRefresh, preserveState }) =>
  `
(function(__ngHotReloadLoaderAngularGlobal) {
  var angular = module.hot ? (function() {
    var loader = require(${corePath});
    return loader.decorateAngular({
      angular: __ngHotReloadLoaderAngularGlobal,
      forceRefresh: Boolean(${forceRefresh}),
      preserveState: Boolean(${preserveState})
    });
  })() : __ngHotReloadLoaderAngularGlobal;
`;

const codeWrapperBottom = ({ requireAngular }) =>
  `
      ;(function() {
        if (!module.hot) {
          return;
        }
        const moduleRegex = /module/i
        const doesRegisterSomethingRegex = /\\.(?:component|directive|controller)/

        function isComponentLoader([exportKey, exportedValue]) {
          if (typeof exportedValue !== 'function') {
            return false
          }
          if (exportedValue.$inject) {
            // This seems like exported service or component or something, our logic doesn't work here.
            return false
          }

          // Get argument names using the same function that angular uses for DI
          const argNames = angular.injector.$$annotate(exportedValue)
          delete exportedValue.$inject; // $$annotate will add this property, we don't need it.

          // We assume that the function is a loader if it has exactly one argument called "module".
          if (argNames.length !== 1 || !moduleRegex.test(argNames[0])) {
            return false
          }
          const functionSource = exportedValue.toString()
          // The function must also do something like module.component(
          return doesRegisterSomethingRegex.test(functionSource)
        }

        const loaderExport = Object.entries(module.exports).find(isComponentLoader)
        if (!loaderExport) return
        const [exportedKey, exportedFunction] = loaderExport

        // Optimistically assume that the exported function is going to register providers.
        angular.__ngHotReload$didRegisterProviders = true

        // Globally store the module name that we are supposed to use.
        if (!window._hotReloadedModulesCache) {
          window._hotReloadedModulesCache = {}
        }
        const moduleId = module.id

        const ngModuleName = window._hotReloadedModulesCache[moduleId]
        if (!ngModuleName) {
          // Export mock function that will capture the module name.
          module.exports[exportedKey] = function(ngModule) {
            const name = window._hotReloadedModulesCache[moduleId] = ngModule.name
            const mod = angular.module(name)
            return exportedFunction(mod)
          };
        } else {
          // We already have the module name and can just call the component loader
          // with mocked angular module.
          exportedFunction(angular.module(ngModuleName));
        }

        module.hot.accept(function(err) {
          if (err) {
            console.error(err);
          }
        });
      })();
})(${ requireAngular});
/* hot-loader end */
`;

async function transform(source, map) {
  if (this.cacheable) {
    this.cacheable();
  }
  const options = loaderUtils.getOptions(this) || {};

  if (noTransform.test(this.resourcePath)) {
    return this.callback(null, source, map);
  }
  const topPart = codeWrapperTop({
    corePath: JSON.stringify(corePath),
    // Boolean options that default to true.
    forceRefresh: options.forceRefresh !== false,
    preserveState: options.preserveState !== false,
  });
  const bottomPart = codeWrapperBottom({
    requireAngular: typeof options.requireAngular === 'string' ?
      options.requireAngular :
      'require("angular")',
  });

  if (!map) {
    // No source maps, just concat the source code together.
    const result = topPart + source + bottomPart;
    this.callback(null, result, map);
    return;
  }

  const callback = this.async();
  await sourceMap.SourceMapConsumer.with(map, null, async (consumer) => {
    const node = sourceMap.SourceNode.fromStringWithSourceMap(source, consumer);
    node.prepend(topPart);
    node.add(bottomPart);
    const result = node.toStringWithSourceMap();
    const newMap = result.map.toJSON();
    callback(null, result.code, newMap);
  });
}

module.exports = transform;