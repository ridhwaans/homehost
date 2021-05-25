import React from "react";
import style from "./MusicHeader.module.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch, faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { useHistory } from "react-router-dom";

const MusicHeader = ({ account }) => {
  const history = useHistory();
  return (
    <div className={style.Header}>
        <div className={style.BackForward}>
          <button onClick={() => { history.goBack() }} className={style.Icon}><FontAwesomeIcon icon={faChevronLeft} /></button>
          <button onClick={() => { history.goForward() }}className={style.Icon}><FontAwesomeIcon icon={faChevronRight} /></button>
        </div>
        <div className={style.SearchBar}>
          <span className={style.Icon}><FontAwesomeIcon icon={faSearch} /></span>
          <input
            placeholder="Search for Artists, Songs, or Podcasts "
            type="text"
          />
        </div>
      <div className={style.HeaderRight}>
        <img alt="Avatar" src={"https://occ-0-2692-360.1.nflxso.net/dnm/api/v6/Z-WHgqd_TeJxSuha8aZ5WpyLcX8/AAAABWyw3UeUMaPP3aLxzskg3Bn5htGHqQymxiEGTbfM91FZ0zJAPoEfYQdvHW7FV06FcdXhPC_4F7zNR7TFKLLv6yo.png?r=88c"} />
        <h4>{account.display_name}</h4>
      </div>
    </div>
  );
}

export default MusicHeader;