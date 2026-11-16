'use strict';

const { execFileSync } = require('node:child_process');

function checkScope(status) {
  const entries = status.split('\0').filter(Boolean);
  if (entries.length !== 1 || entries[0] !== ' M src/math.js') {
    throw new Error(`Expected only an unstaged edit to src/math.js; got ${JSON.stringify(entries)}`);
  }
}

if (require.main === module) {
  try {
    const status = execFileSync('git', ['status', '--porcelain=v1', '-z', '--untracked-files=all', '--ignored=matching'], {
      encoding: 'utf8',
    });
    checkScope(status);
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}

module.exports = { checkScope };
