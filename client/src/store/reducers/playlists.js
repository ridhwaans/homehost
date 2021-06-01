const playlistReducer = (
  state = {
    albums: [],
    artists: [],
  },
  action
) => {
  switch (action.type) {
    case "init":
      return { albums: action.albums, artists: action.artists };
    default:
      return state;
  }
};

export default playlistReducer;
