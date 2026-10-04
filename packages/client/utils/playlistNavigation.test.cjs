const { test } = require('node:test');
const assert = require('node:assert/strict');

const { getNextIndex, getPreviousIndex } = require('./playlistNavigation.cjs');

test('next navigation advances and wraps at the end', () => {
  assert.equal(getNextIndex(0, 3), 1);
  assert.equal(getNextIndex(2, 3), 0);
  assert.equal(getNextIndex(0, 1), 0);
  assert.equal(getNextIndex(0, 0), null);
});

test('previous navigation reverses and wraps at the beginning', () => {
  assert.equal(getPreviousIndex(2, 3), 1);
  assert.equal(getPreviousIndex(0, 3), 2);
  assert.equal(getPreviousIndex(0, 1), 0);
  assert.equal(getPreviousIndex(0, 0), null);
});
