'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { add, factorial } = require('../src/math');

test('preserves the existing add behavior', () => {
  assert.equal(add(2, 3), 5);
});

test('computes factorial for the boundaries and a typical value', () => {
  assert.equal(factorial(0), 1);
  assert.equal(factorial(1), 1);
  assert.equal(factorial(5), 120);
  assert.equal(factorial(18), 6402373705728000);
});

test('rejects non-number and non-integer input', () => {
  for (const value of ['3', null, 2.5, NaN, Infinity, -Infinity]) {
    assert.throws(() => factorial(value), TypeError);
  }
});

test('rejects integers outside the supported range', () => {
  for (const value of [-1, 19, Number.MAX_SAFE_INTEGER]) {
    assert.throws(() => factorial(value), RangeError);
  }
});
