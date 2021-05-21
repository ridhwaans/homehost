import React, { useCallback, useEffect, useState }  from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
import Sidebar from "../MusicSidebar/SideBar";
import Playlists from "../Playlists/Playlists";
import PlaylistDetail from "../PlaylistDetail/PlaylistDetail";
import { getMusicBy, getAllAlbums } from "../../api"
import style from "./MusicBody.module.css"

const MusicBody = () => {
  const [albums, setAlbums] = useState(null);
  
  const loadPlaylists = useCallback(async () => {
    await getMusicBy("recently_added").then((data) => {
      setAlbums(data);
    });
  }, []);

  useEffect(() => {
    loadPlaylists();
  });

  return (
    <div className={style.App}>
      <Router>
      <Sidebar playlists={albums}/>

      <Route path="/music" exact>
        {albums && <Playlists playlists={albums}/>}
      </Route>
      
      <Route path="/music/playlist/:id">
        <PlaylistDetail />
      </Route>
      </Router>
    </div>
  );
};
export default MusicBody;
