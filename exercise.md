# Exercise: safe factorial

Implement and export `factorial(n)` from `src/math.js` without changing the existing `add` export.

* For an integer `n` from 0 through 18 inclusive, return `n!` as a JavaScript number. `0!` is 1.
* Reject values that are not numbers or are not integers with a `TypeError`.
* Reject integers outside the inclusive range 0 through 18 with a `RangeError`.
* Do not change any other file. No dependencies or network access are needed.

The tests in `test/math.test.js` are the acceptance evidence, not an exhaustive security proof.
