const playlistReducer = (
  state = {
    albums: [],
  },
  action
) => {
  switch (action.type) {
    case "init":
      return { albums: action.albums };
    default:
      return state;
  }
};

export default playlistReducer;
