import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    albums: [], 
    artists: [], 
    songs: [],
};

const musicSlice = createSlice({
  name: 'music',
  initialState,
  reducers: {
    addManyAlbums(state, action) {
      state.albums.push(...action.payload);
    },
    deleteManyAlbums(state, action) {
      state.albums = state.albums.filter(item => action.payload.map(item => item.id).indexOf(item.id) === -1); 
    },
    addManyArtists(state, action) {
        state.artists.push(...action.payload);
    },
    deleteManyArtists(state, action) {
        state.artists = state.artists.filter(item => action.payload.map(item => item.id).indexOf(item.id) === -1); 
    },
    addManySongs(state, action) {
        state.songs.push(...action.payload);
    },
    deleteManySongs(state, action) {
        state.songs = state.songs.filter(item => action.payload.map(item => item.id).indexOf(item.id) === -1); 
    },
  },
});

export const { addManyAlbums, deleteManyAlbums, addManyArtists, deleteManyArtists, addManySongs, deleteManySongs } = musicSlice.actions;

export default musicSlice.reducer;