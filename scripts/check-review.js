'use strict';

const fs = require('node:fs');

function checkReview(text) {
  const review = JSON.parse(text);
  if (!review || Array.isArray(review) || typeof review !== 'object') {
    throw new Error('Review must be a JSON object');
  }
  const validStrings = (items) =>
    Array.isArray(items) && items.every((item) => typeof item === 'string' && item.trim());
  if (!['pass', 'block'].includes(review.verdict) ||
      typeof review.summary !== 'string' || !review.summary.trim() ||
      !validStrings(review.findings) ||
      !validStrings(review.evidence) || review.evidence.length === 0) {
    throw new Error('Review must contain verdict, summary, findings, and nonempty evidence');
  }
  if (review.verdict !== 'pass') {
    throw new Error('Reviewer blocked the change');
  }
}

if (require.main === module) {
  try {
    checkReview(fs.readFileSync(process.argv[2], 'utf8'));
  } catch (error) {
    console.error(`Review gate failed: ${error.message}`);
    process.exitCode = 1;
  }
}

module.exports = { checkReview };
