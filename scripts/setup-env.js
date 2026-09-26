/* eslint-env node */
/**
 * Creates src/utils/env.js from src/utils/env.example.js when it does not
 * exist yet, so a fresh clone bundles. Runs on `postinstall` and through
 * `npm run setup:env`. It never overwrites an existing env.js.
 */
const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '..', 'src', 'utils');
const example = path.join(dir, 'env.example.js');
const target = path.join(dir, 'env.js');

if (!fs.existsSync(target)) {
  fs.copyFileSync(example, target);
  console.log(
    `[setup-env] Created ${path.relative(process.cwd(), target)} from ` +
      'env.example.js. Set TMDB_API_KEY there before running the app.',
  );
}
