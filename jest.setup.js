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

// Native modules with no JS fallback under Jest. Without these the smoke test
// never got past importing the navigation stack: react-native-gesture-handler
// reads NativeModules.RNGestureHandlerModule.Direction at import time.
import 'react-native-gesture-handler/jestSetup';

// Reanimated's own mock runs `call(args, fn)` immediately. Real Reanimated only
// builds a node from it, and the drawer builds its node graph while its
// constructor is still running, so the mock called drawer methods that did not
// exist yet ("toggleStatusBar is not a function"). Building nothing is closer
// to the real behaviour.
jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  const call = () => undefined;

  return {
    ...Reanimated,
    call,
    default: { ...Reanimated.default, call },
  };
});

// The screens call TMDb on mount. Tests must never hit the network, and a
// request that never settles keeps state updates out of a finished test.
global.fetch = jest.fn(() => new Promise(() => {}));
