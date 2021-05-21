const playlistReducer = (
  state = {
    playlists: [],
  },
  action
) => {
  switch (action.type) {
    case "init":
      return { playlists: action.playlists };
    default:
      return state;
  }
};

export default playlistReducer;
