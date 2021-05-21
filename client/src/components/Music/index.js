import React, { useEffect, useState, useContext } from 'react';

import { Provider } from "react-redux";
import { createStore, compose, combineReducers } from "redux";
import playlistReducer from "../../store/reducers/playlists";
import playingReducer from "../../store/reducers/playing";

import { getAllAlbums } from "../../api"
import BigBillboard from "../BigBillboard"
import MediumBillboard from "../MediumBillboard"
import Slider from "../Slider"
import Search from '../Search';
import SearchContext from "../Search/context"
import MusicBody from '../MusicBody/MusicBody';

function Music() {
    const [albums, setAlbums] = useState(null)

    const searchContext = useContext(SearchContext)

    const fetchMusic = async () => {
        let allAlbums = await getAllAlbums()

        return { allAlbums }
    }

    useEffect(() => {
        
        fetchMusic().then(response => {
            setAlbums(response.allAlbums)
        })
        return () => {
            setAlbums(null)
        }

    }, [])

    const reducers = combineReducers({
        playlists: playlistReducer,
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
