'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { checkScope } = require('../scripts/check-scope');
const { checkReview } = require('../scripts/check-review');

test('scope gate rejects missing, additional, staged, and untracked changes', () => {
  assert.doesNotThrow(() => checkScope(' M src/math.js\0'));
  for (const status of ['', 'M  src/math.js\0', ' M src/math.js\0?? extra.js\0',
    ' M src/math.js\0 M test/math.test.js\0']) {
    assert.throws(() => checkScope(status));
  }
});

test('review gate accepts only a passing structured review with evidence', () => {
  const review = { verdict: 'pass', summary: 'Reviewed', findings: [], evidence: ['test log'] };
  assert.doesNotThrow(() => checkReview(JSON.stringify(review)));
  for (const invalid of ['not json', '{}', JSON.stringify({ ...review, verdict: 'block' }),
    JSON.stringify({ ...review, evidence: [] }),
    JSON.stringify({ ...review, evidence: [' '] }),
    JSON.stringify({ ...review, findings: [1] })]) {
    assert.throws(() => checkReview(invalid));
  }
});
