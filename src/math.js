'use strict';

function add(a, b) {
  return a + b;
}

function factorial(n) {
  throw new Error('Not implemented');
}

module.exports = { add, factorial };
