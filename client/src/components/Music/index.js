import React, { useEffect, useState, useContext } from 'react';

import { Provider } from "react-redux";
import { createStore, compose, combineReducers } from "redux";
import playlistReducer from "../../store/reducers/playlists";
import playingReducer from "../../store/reducers/playing";

import { getAllAlbums } from "../../api"
import BigBillboard from "../BigBillboard"
import MediumBillboard from "../MediumBillboard"
import GridCell from "../GridCell"
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

    const handleCellClick = (event) => {
        var element = event.target.parentNode.id.toString() // Get id of GridCell container

    }

    const grid = () => {
        var grid = []
        //console.log(`album count is ${albums.length}`)
        for (var i in albums) {
        var gridCell_id = 'grid_cell_' + i.toString()
        grid.push(<GridCell 
            id={gridCell_id}
            handleCellClick={handleCellClick.bind(this)}
            gridCellData={JSON.stringify(albums[i])}
            type={1}/>)
        }
        return grid;
    }

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

    return (
        <div className="grid-holder">
            {searchContext.searchInput.length > 0 ? (<Search />) : (
                <div>
                    {albums && grid()}
                </div>
        )}
        </div>
        );
}

export default Music;
