import React from 'react';

import { Provider } from "react-redux";
import { createStore, combineReducers } from "redux";
import playlistReducer from "../../store/reducers/playlists";
import playingReducer from "../../store/reducers/playing";

import MusicBody from '../MusicBody/MusicBody';

function Music() {

    const reducers = combineReducers({
        albums: playlistReducer,
        playing: playingReducer,
      });
      
    const store = createStore(reducers);

    return (
        <Provider store={store}>
            <MusicBody />
        </Provider>
    );
}

export default Music;
