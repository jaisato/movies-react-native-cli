/* eslint-env jest */
/**
 * Jest setup, run before every test file ("jest.setupFiles" in package.json).
 *
 * `src/utils/env.js` is git-ignored (it holds the developer's real TMDb key),
 * so it may not exist on a fresh clone or on CI. Mock it as a virtual module:
 * `src/utils/constants.js` then always resolves it and never throws for an
 * empty key during tests. The mock is used even when a real env.js exists.
 */
jest.mock('./src/utils/env', () => ({ TMDB_API_KEY: 'test-tmdb-api-key' }), {
  virtual: true,
});
