import React, { useEffect, useRef, useState } from "react";
import { connect } from "react-redux";
import { useParams } from "react-router-dom";

import { millisToEnglishWords } from "../../utils";
import { getAlbumInformation } from "../../api"
import { SongItem } from "./SongItem/SongItem";
import FastAverageColor from "fast-average-color";
import style from "./PlaylistDetail.module.css";
import Time from "../../assets/Time";

const PlaylistDetail = ({ loadSong, currentSong }) => {
    const { id } = useParams();
    const [playlist, setPlaylist] = useState(null);
    const coverRef = useRef(null);
  
    useEffect(() => {
      loadPlaylistDetails(id);
    }, [id]);
  
    useEffect(() => {
      if (coverRef.current) {
        coverRef.current.crossOrigin = "Anonymous";
        const fac = new FastAverageColor();
        fac
          .getColorAsync(coverRef.current)
          .then((color) => {
            if (document.getElementById('Background')){
              document.getElementById('Background').style.backgroundColor = color.rgb;
            }
            if (document.getElementById('PlaylistBackground')){
              document.getElementById('PlaylistBackground').style.backgroundColor = color.rgb;
              //remove background: #141414; from html, body {}
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }
    }, [playlist]);

    const loadPlaylistDetails = async (playlistId) => {
      await getAlbumInformation(playlistId).then((data) => {
        setPlaylist(data);
      });
    };

    const songClicked = (song) => {
      if (song.url_path) {
        song.album_image_url = playlist.images[0].url
        song.artists = playlist.artists
        loadSong(song);
      }
    };
    //playlist && playlist.tracks && playlist.tracks.items && console.log(playlist.tracks.total_duration_ms)
    return (
      <React.Fragment>
        {playlist && playlist.tracks && playlist.tracks.items && (
          <div className={style.PlaylistDetail}>
            <div className={style.Cover}>
              <div className={style.Background} id="Background"></div>
              <div className={style.Gradient}></div>
              <div className={style.Img}>
                <img
                  src={playlist.images[0].url}
                  alt="playlist img"
                  ref={coverRef}
                />
              </div>
              <div className={style.Infos}>
                <div className={style.Playlist}>PLAYLIST</div>
                <div className={style.Title}>
                  <h1>{playlist.name}</h1>
                </div>
                <div className={style.Categ}>{playlist.description}</div>
                <div className={style.Details}>
                  <span className={style.Text_Bold}>
                    {playlist.artists[0].name}
                  </span>
                  <span className={style.Text_Light}>
                    {
                    `${playlist.tracks.local_total} local tracks out of ${playlist.total_tracks} songs, 
                    about ${millisToEnglishWords(playlist.tracks.total_duration_ms)}`
                    }
                  </span>
                </div>
              </div>
            </div>
  
            <div className={style.List_Background} id="PlaylistBackground" />
            <div className={style.List}>
              <div className={style.Heading_Sticky}>
                <div className={style.Heading}>
                  <div>#</div>
                  <div>Title</div>
                  <div></div>
                  <div></div>
                  <div className={style.Length}>
                    <Time />
                  </div>
                </div>
              </div>

              {playlist.tracks.items.map((item, index) => (
                <SongItem
                  key={item.id}
                  song={item}
                  artists={playlist.artists}
                  index={index}
                  current={currentSong && item.id === currentSong.id ? true : false}
                  songClicked={() => songClicked(item)}
                />
              ))}
            </div>
            <div className={style.List_Footer}>
              <p>© {parseInt(playlist.release_date)} {playlist.label} </p>
              <p>℗ {parseInt(playlist.release_date)} {playlist.label} </p>
            </div>
          </div>
        )}
      </React.Fragment>
    );
  };
  
  const mapStateToProps = (state) => {
    //console.log(`state is ${JSON.stringify(state.playing)}`);
    return {
      currentSong: state.playing.song,
    };
  };
  
  const mapDispatchToProps = (dispatch) => {
    return {
      loadSong: (song) => dispatch({ type: "load", song }),
    };
  };

  export default connect(mapStateToProps, mapDispatchToProps)(PlaylistDetail);