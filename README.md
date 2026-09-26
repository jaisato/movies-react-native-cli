# themovieapp

React Native (CLI) app that browses movies from [The Movie Database (TMDb)](https://www.themoviedb.org/).

## Requirements

- Node and Yarn (the repository ships a `yarn.lock`).
- The React Native CLI environment for iOS and/or Android: https://reactnative.dev/docs/environment-setup

## Setup

1. Install the dependencies:

   ```sh
   yarn install
   ```

   The `postinstall` script creates `src/utils/env.js` from `src/utils/env.example.js` when it does not exist yet. If you installed with `--ignore-scripts`, create it yourself:

   ```sh
   npm run setup:env   # or: cp src/utils/env.example.js src/utils/env.js
   ```

2. Get a free TMDb API key at https://www.themoviedb.org/settings/api and put it in `src/utils/env.js`:

   ```js
   export const TMDB_API_KEY = 'your-key-here';
   ```

   `src/utils/env.js` is git-ignored: never commit a real key. With an empty key the app fails at startup with a message that says exactly this.

3. iOS only: `cd ios && pod install`.

## Run

```sh
yarn start      # Metro bundler
yarn ios        # or: yarn android
```

## Test and lint

```sh
yarn test
yarn lint
```

Tests never need a real key: `jest.setup.js` mocks `src/utils/env.js`.
