const { test } = require('node:test');
const assert = require('node:assert/strict');

const { sliderValueToVolume } = require('./volume.cjs');

test('converts the 0-to-100 slider scale to the audio volume scale', () => {
  assert.equal(sliderValueToVolume(70), 0.7);
  assert.equal(sliderValueToVolume('25'), 0.25);
  assert.equal(sliderValueToVolume(0), 0);
  assert.equal(sliderValueToVolume(100), 1);
});
