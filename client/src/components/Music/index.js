
import { Provider } from "react-redux";
import { createStore, combineReducers } from "redux";
import playlistReducer from "../../store/reducers/playlists";
import playingReducer from "../../store/reducers/playing";

import React, { useCallback, useEffect, useState }  from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
import SideBar from "../MusicSidebar/SideBar";
import MusicHeader from "../MusicHeader/MusicHeader"

import MusicHome from "../MusicHome/MusicHome";
import MusicSearch from "../MusicSearch";
import Albums from "../Albums/Albums";
import AlbumDetail from "../AlbumDetail/AlbumDetail";
import Artists from "../Artists/Artists";

import NowPlayingBar from "../NowPlayingBar/NowPlayingBar";
import style from "./Music.module.css"

import { getAllArtists, getAllAlbums } from "../../api"
import { connect } from "react-redux";

const Music = () => {

  useEffect(() => {
      document.documentElement.className = ""; //<head>
      document.body.className = style.MusicBody; //<body>
  }, [])

  const reducers = combineReducers({
      albums: playlistReducer,
      artists: playlistReducer,
      playing: playingReducer,
  });
  
  const store = createStore(reducers);

  return (
    <Provider store={store}>
      <div className={style.App}>
        <Router>
          <SideBar />
          <MusicHeader account={{display_name: "Test User"}}/>
          <Route path="/music" exact>
            <MusicHome />
          </Route>   
          <Route path="/music/search">
            <MusicSearch />
          </Route>
          <Route path="/music/albums">
            <Albums />
          </Route>   
          <Route path="/music/album/:id">
            <AlbumDetail />
          </Route>
          <Route path="/music/artists">
            <Artists />
          </Route> 
        </Router>
        <NowPlayingBar />
      </div>
    </Provider>
  );
};

const mapStateToProps = (state) => {
  return {
    albums: state.albums,
    artists: state.artists,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    initAlbums: (data) => dispatch({ type: "init", albums: data }),
    initArtists: (data) => dispatch({ type: "init", artists: data }),
  };
};

export default Music;
