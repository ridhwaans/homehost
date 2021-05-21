import React, { useCallback, useEffect, useState }  from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
import SideBar from "../MusicSidebar/SideBar";
import AudioPlayer from "../AudioPlayer/AudioPlayer";
import style from "./MusicBody.module.css"

import Playlists from "../Playlists/Playlists";
import PlaylistDetail from "../PlaylistDetail/PlaylistDetail";
import { getMusicBy, getAllAlbums } from "../../api"
import { connect } from "react-redux";

const MusicBody = ({ playlists, initPlaylists }) => {
  const [albums, setAlbums] = useState(null);
  
  const loadPlaylists = useCallback(async () => {
    //getMusicBy("recently_added"), getAllAlbums()
    await getAllAlbums().then((data) => {
      //setAlbums(data);
      initPlaylists(data);
    });
  }, [initPlaylists]);

  useEffect(() => {
    loadPlaylists();
  });

  return (
    <React.Fragment>
      <div className={style.App}>
        <Router>
          {playlists && <SideBar />}

        <Route path="/music" exact>
          {playlists && <Playlists />}
        </Route>
        
        <Route path="/music/playlist/:id">
          <PlaylistDetail />
        </Route>

        </Router>
      </div>
      <AudioPlayer />
    </React.Fragment>
  );
};

const mapStateToProps = (state) => {
  return {
    playlists: state.playlists,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    initPlaylists: (data) => dispatch({ type: "init", playlists: data }),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(MusicBody);
