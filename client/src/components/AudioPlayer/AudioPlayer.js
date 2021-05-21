import React, { useEffect, useRef, useState } from "react";
import { connect } from "react-redux";
import Sound from "react-sound";
import { millisToMinutesAndSeconds, useBar } from "../../utils";
import styles from "./AudioPlayer.module.css";
import Like from "../../assets/Like";
import Play from "../../assets/Play";
import Pause from "../../assets/Pause";
import Volume from "../../assets/Volume";
import VolumeMuted from "../../assets/VolumeMuted";

const AudioPlayer = ({ playPause, song, playing }) => {
  const [time, setTime] = useState(0);
  const timeRef = useRef(null);
  const [progress, setProgress] = useState(0);

  const [volume, setVolume] = useState(70);
  const volumeRef = useRef(null);

  const [mute, setMute] = useState(false);

  const barCallBack = useBar;

  useEffect(() => {
    // Adjust time when progress bar is clicked
    setTime((progress * 30000) / 100);
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
    console.log("player render time")
    return (
      <div className={styles.Player}>
        <footer>
          <div className={styles.Song}>
            <div className={styles.Img}>
              <img src={song.album_image_url} alt="song" />
            </div>
            <div className={styles.Infos}>
              <div className={styles.Name}>{song.name}</div>
              <div className={styles.Artist}>{song.artists[0].name}</div>
            </div>
            <div className={styles.Like}>
              <Like />
            </div>
          </div>

          <div className={styles.Controls}>
            <div>
              <button onClick={playPause}>
                {playing ? <Pause /> : <Play />}
              </button>
            </div>
            <div className={styles.BarContainer}>
              <div>{millisToMinutesAndSeconds(time)}</div>
              <div
                className={styles.Wrapper}
                onClick={(event) => barCallBack(event, timeRef, setProgress)}
                ref={timeRef}
              >
                <div className={styles.Bar}>
                  <div
                    className={styles.Progress}
                    style={{ transform: `translateX(-${100 - progress}%)` }}
                  />
                </div>
                <button style={{ left: `${progress}%` }} />
              </div>
              <div>0:30</div>
            </div>
          </div>

          <div className={styles.Volume}>
            <div>
              <button onClick={() => setMute(!mute)}>
                {mute ? <VolumeMuted /> : <Volume />}
              </button>
            </div>
            <div
              className={styles.Wrapper}
              onClick={(event) => barCallBack(event, volumeRef, setVolume)}
              ref={volumeRef}
            >
              <div className={styles.Bar}>
                <div
                  className={styles.Progress}
                  style={{
                    transform: `translateX(-${mute ? "100" : 100 - volume}%)`,
                  }}
                />
              </div>
              <button style={{ left: `${mute ? "0" : volume}%` }} />
            </div>
          </div>
        </footer>
        { song.preview_url && (
          <Sound
            url={song.preview_url}
            playStatus={playing ? "PLAYING" : "PAUSED"}
            //@ts-ignore
            onPlaying={({ position }) => {
              setTime(position);
              setProgress((position * 100) / 30000);
            }}
            onFinishedPlaying={() => playPause()}
            volume={mute ? 0 : volume}
            position={time}
          />
        )}
      </div>
    );
  }
};

const mapStateToProps = (state) => {
  return {
    song: state.playing.song,
    playing: state.playing.playing,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    playPause: () => dispatch({ type: "playpause" }),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AudioPlayer);