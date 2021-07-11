import React, { useCallback, useEffect, useState }  from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
import { Provider, connect } from "react-redux";
import { createStore, combineReducers } from "redux";

import { getArtistsBy, getAlbumsBy, getSongsBy } from "../../api"
import playlistReducer from "../../store/reducers/playlists";
import playingReducer from "../../store/reducers/playing";

import SideBar from "../MusicSidebar/SideBar";
import MusicHeader from "../MusicHeader/MusicHeader"

import MusicHome from "../MusicHome/MusicHome";
import MusicSearch from "../MusicSearch";
import Albums from "../Albums/Albums";
import AlbumDetail from "../AlbumDetail/AlbumDetail";
import Artists from "../Artists/Artists";
import Songs from "../Songs/Songs";

import NowPlayingBar from "../NowPlayingBar/NowPlayingBar";
import style from "./Music.module.css"

const Music = () => {

  const [albums, setAlbums] = useState(null)
  const [artists, setArtists] = useState(null)
  const [songs, setSongs] = useState(null)

  const fetchMusic = async () => {
    let albums = await getAlbumsBy("latest")
    let artists = await getArtistsBy("most_popular")
    let songs = await getSongsBy("recently_added")

    return { albums, artists, songs }
  }

  useEffect(() => {
      document.documentElement.className = ""; //<head>
      document.body.className = style.MusicBody; //<body>

      fetchMusic().then(response => {

        setAlbums(response.albums)
        setArtists(response.artists)
        setSongs(response.songs)
      })
      return () => {
        setAlbums(null)
        setArtists(null)
        setSongs(null)
      }
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
          <MusicHeader account={{display_name: "User"}}/>
          <Route path="/music" exact>
            <MusicHome albums={albums} artists={artists} songs={songs}/>
          </Route>   
          <Route path="/music/search">
            <MusicSearch />
          </Route>
          <Route path="/music/albums">
            <Albums/>
          </Route>   
          <Route path="/music/album/:id">
            <AlbumDetail />
          </Route>
          <Route path="/music/artists">
            <Artists />
          </Route> 
          <Route path="/music/songs">
            <Songs />
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
