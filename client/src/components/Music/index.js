import React, { useCallback, useEffect, useState }  from 'react';
import { Outlet } from "react-router-dom";
import { Provider, connect } from "react-redux";
import { createStore, combineReducers } from "redux";

import playlistReducer from "../../store/reducers/playlists";
import playingReducer from "../../store/reducers/playing";
import store from "../../store/store"

import SideBar from "../MusicSidebar/SideBar";
import MusicHeader from "../MusicHeader/MusicHeader"
import NowPlayingBar from "../NowPlayingBar/NowPlayingBar";
import style from "./Music.module.css"

const Music = () => {

  useEffect(() => {
    document.documentElement.className = ""; //<head>
    document.body.className = style.MusicBody; //<body>
  });

  const reducers = combineReducers({
      albums: playlistReducer,
      artists: playlistReducer,
      playing: playingReducer,
  });

  return (
    <Provider store={store}>
      <div className={style.App}>
        <SideBar />
        <MusicHeader account={{display_name: "User"}}/>
          <Outlet />
        <NowPlayingBar />
      </div>
    </Provider>
  );
};

export default Music;