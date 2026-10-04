const getNextIndex = (currentIndex, playlistLength) => {
  if (playlistLength === 0) return null;
  if (
    !Number.isInteger(currentIndex) ||
    currentIndex < 0 ||
    currentIndex >= playlistLength
  ) {
    return 0;
  }
  return currentIndex === playlistLength - 1 ? 0 : currentIndex + 1;
};

const getPreviousIndex = (currentIndex, playlistLength) => {
  if (playlistLength === 0) return null;
  if (
    !Number.isInteger(currentIndex) ||
    currentIndex < 0 ||
    currentIndex >= playlistLength
  ) {
    return playlistLength - 1;
  }
  return currentIndex === 0 ? playlistLength - 1 : currentIndex - 1;
};

module.exports = { getNextIndex, getPreviousIndex };
