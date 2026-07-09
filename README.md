# themovieapp

React Native (CLI) app that lists movies using [The Movie Database (TMDB)](https://www.themoviedb.org/) API.

## Security

- A TMDB API key was previously committed to this repository. It remains in the git history, so it is **compromised** and must be **revoked/regenerated** in your account settings at [themoviedb.org](https://www.themoviedb.org/settings/api).
- The key is no longer stored in source. To run the app, copy `src/utils/apiKey.example.js` to `src/utils/apiKey.js` and set your own TMDB API key there. `src/utils/apiKey.js` is git-ignored and must never be committed.
