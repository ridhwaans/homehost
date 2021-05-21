import React from "react"
import PlaylistItem from "./PlaylistItem/PlaylistItem"
import style from "./Playlists.module.css"

const Playlists = (props) => {
    var playlists = props.playlists;

    return (
      <div className={style.Playlists}>
        <h1 className={style.Title}>Playlists</h1>

        <div className={style.Container}>
          {playlists && playlists.map(item => { return <PlaylistItem key={item.id} playlist={item}/> }) }
        </div>
      </div>
    );
};
var mapStateToProps = function (state) {
    return {
        playlists: state.playlists.playlists
    };
};
export default Playlists;
