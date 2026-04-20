const path = require('path');
const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * Force a single React instance in the bundle. If Metro assigns two module IDs to
 * `react` (e.g. `react` vs `react/jsx-runtime` vs deep paths), hooks from
 * @react-navigation/elements (useFrameSize → useContext) throw "Invalid hook call".
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const projectRoot = __dirname;
const nm = path.join(projectRoot, 'node_modules');

module.exports = mergeConfig(getDefaultConfig(projectRoot), {
  resolver: {
    extraNodeModules: {
      react: path.join(nm, 'react'),
    },
    resolveRequest: (context, moduleName, platform) => {
      const isReactCore =
        moduleName === 'react' ||
        (typeof moduleName === 'string' && moduleName.startsWith('react/'));

      if (isReactCore) {
        try {
          const filePath = require.resolve(moduleName, { paths: [nm] });
          return { type: 'sourceFile', filePath };
        } catch {
          // Unknown react/* subpath — fall back to Metro
        }
      }
      return context.resolveRequest(context, moduleName, platform);
    },
  },
});
