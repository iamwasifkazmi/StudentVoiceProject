/**
 * Metro resolves `import … from '@env'` before Babel runs. This shim satisfies
 * resolution; `react-native-dotenv` then inlines real values from `.env` into
 * files that import `@env` (so this file is not used at runtime in the bundle).
 */
module.exports = {};
