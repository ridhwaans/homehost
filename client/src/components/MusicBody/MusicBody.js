import React, { useCallback, useEffect }  from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
import SideBar from "../MusicSidebar/SideBar";
import MusicHeader from "../MusicHeader/MusicHeader"

import AudioPlayer from "../AudioPlayer/AudioPlayer";
import style from "./MusicBody.module.css"

import Albums from "../Albums/Albums";
import AlbumDetail from "../AlbumDetail/AlbumDetail";
import { getMusicBy, getAllAlbums } from "../../api"
import { connect } from "react-redux";

const MusicBody = ({ albums, initAlbums }) => {
  
  const loadAlbums = useCallback(async () => {
    //getMusicBy("recently_added"), getAllAlbums()
    await getAllAlbums().then((data) => {
      initAlbums(data);
    });
  }, [initAlbums]);

  useEffect(() => {
    document.documentElement.className = ""; //<head>
    document.body.className = style.MusicBody; //<body>
    loadAlbums();
  });

  return (
    <React.Fragment>
      <div className={style.App}>
        <Router>
          {albums && <SideBar />}
          <MusicHeader account={{display_name: "Test User"}}/>
          <Route path="/music" exact>
            {albums && <Albums />}
          </Route>   
          <Route path="/music/album/:id">
            <AlbumDetail />
          </Route>
        </Router>
        <AudioPlayer />
      </div>
      
    </React.Fragment>
  );
};

const mapStateToProps = (state) => {
  return {
    albums: state.albums,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    initAlbums: (data) => dispatch({ type: "init", albums: data }),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(MusicBody);
