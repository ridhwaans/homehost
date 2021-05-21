import { Link } from "react-router-dom";
import React from "react"
import ListItem from "./ListItem/ListItem"
import SidebarOption from "./SidebarOption/SidebarOption"
import style from "./SideBar.module.css"
import Logo from "../../assets/Logo"
import { faHome, faSearch, faMusic, faFilm, faTv, faPodcast, faBook, faFolderPlus, faList } from "@fortawesome/free-solid-svg-icons";

const SideBar = ({ playlists }) => {
    return (
      <div className={style.SideBar}>
        <Link style={{ textDecoration: "none", color: "white" }} to="/music">
            <div className={style.Logo}>
                <Logo />
            </div>
        </Link>

        <SidebarOption Icon={faHome} option="Home" />
        <SidebarOption Icon={faSearch} option="Search" />
        <SidebarOption Icon={faMusic} option="Music" />
        <SidebarOption Icon={faFilm} option="Movies" />
        <SidebarOption Icon={faTv} option="TV Shows" />
        <SidebarOption Icon={faPodcast} option="Podcasts" />
        <SidebarOption Icon={faBook} option="Books" />
        <SidebarOption Icon={faBook} option="Comics" />
        <SidebarOption Icon={faFolderPlus} option="Recently Added" />
        <SidebarOption Icon={faList} option="My List" />

        <h1 className={style.Title}>Playlists</h1>

        <hr className={style.Separator} />

        <div className={style.ListContainer}>
            <ul className={style.List}>
                {playlists && playlists.map(item => { return <ListItem playlist={item} key={item.id} /> }) }
            </ul>
        </div>
      </div>
    );
};
var mapStateToProps = function (state) {
    return {
        playlists: state.playlists.playlists
    };
};
export default SideBar;
