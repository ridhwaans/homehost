import React, { useEffect, useRef, useState } from "react";
import useSound from 'use-sound';
import { millisToMinutesAndSeconds, useBar } from "../../utils";
import style from "./NowPlayingBar.module.css";
import Like from "../../assets/NowPlayingBar/Like";
import Play from "../../assets/NowPlayingBar/Play";
import Pause from "../../assets/NowPlayingBar/Pause";
import Volume from "../../assets/NowPlayingBar/Volume";
import VolumeMuted from "../../assets/NowPlayingBar/VolumeMuted";

const NowPlayingBar = ({ playPause, song, playing }) => {
  const [time, setTime] = useState(0);
  const timeRef = useRef(null);
  
  const [volume, setVolume] = useState(70);
  const volumeRef = useRef(null);
  
  const [progress, setProgress] = useState(0);
  const [mute, setMute] = useState(false);

  const barCallBack = useBar;
  if (song && song.preview_url != null && song.url_path == null){
    song.url_path = song.preview_url;
    song.duration_ms = 30000;
  }

  const [play, { stop, isPlaying }] = useSound(song.url_path);

  useEffect(() => {
    // Adjust time when progress bar is clicked
    song && setTime((progress * song.duration_ms ) / 100);
  }, [progress]);

  useEffect(() => {
    //Reset progress if the song change
    setProgress(0);
    setTime(0);
  }, [song]);

  useEffect(() => {
    if (volume < 5) {
      setMute(true);
    } else {
      setMute(false);
    }
  }, [volume]);

  if (!song) {
    return null;
  } else {
    return (    
        <div className={style.Player}>
        <footer>
          <div className={style.Song}>
            <div className={style.Img}>
              <img src={song.album_image_url} alt="song" />
            </div>
            <div className={style.Infos}>
              <div className={style.Name}>{song.name}</div>
              <div className={style.Artist}>{song.artists[0].name}</div>
            </div>
            <div className={style.Like}>
              <Like />
            </div>
          </div>

          <div className={style.Controls}>
            <div>
              <button onClick={playPause}>
                {playing ? <Pause /> : <Play />}
              </button>
            </div>
            <div className={style.BarContainer}>
              <div>{millisToMinutesAndSeconds(time)}</div>
              <div
                className={style.Wrapper}
                onClick={(event) => barCallBack(event, timeRef, setProgress)}
                ref={timeRef}
              >
                <div className={style.Bar}>
                  <div
                    className={style.Progress}
                    style={{ transform: `translateX(-${100 - progress}%)` }}
                  />
                </div>
                <button style={{ left: `${progress}%` }} />
              </div>
              <div>{millisToMinutesAndSeconds(song.duration_ms)}</div>
            </div>
          </div>

          <div className={style.Volume}>
            <div>
              <button onClick={() => setMute(!mute)}>
                {mute ? <VolumeMuted /> : <Volume />}
              </button>
            </div>
            <div
              className={style.Wrapper}
              onClick={(event) => barCallBack(event, volumeRef, setVolume)}
              ref={volumeRef}
            >
              <div className={style.Bar}>
                <div
                  className={style.Progress}
                  style={{
                    transform: `translateX(-${mute ? "100" : 100 - volume}%)`,
                  }}
                />
              </div>
              <button style={{ left: `${mute ? "0" : volume}%` }} />
            </div>
          </div>
        </footer>
      </div>
    );
  }
};

export default NowPlayingBar;