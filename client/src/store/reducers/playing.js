const playingReducer = (
  state = {
    song: null,
    playing: true,
  },
  action
) => {
  switch (action.type) {
    case "load":
      return {
        playing: true,
        song: action.song,
      };
    case "playpause":
      return {
        ...state,
        playing: !state.playing,
      };
    default:
      return state;
  }
};

export default playingReducer;
