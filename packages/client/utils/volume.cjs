const sliderValueToVolume = (value) => {
  const numericValue = Number(value);
  if (!Number.isFinite(numericValue)) return 0;

  return Math.min(100, Math.max(0, numericValue)) / 100;
};

module.exports = { sliderValueToVolume };
