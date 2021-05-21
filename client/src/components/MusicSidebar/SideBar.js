import React from "react"
import { Link } from "react-router-dom";
import { connect } from "react-redux";
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

        <a style={{ textDecoration: "none", color: "white" }} href="/">
            <SidebarOption Icon={faHome} option="Home"/>
        </a>

        <SidebarOption Icon={faSearch} option="Search" />

        <Link style={{ textDecoration: "none", color: "white" }} to="/music">
            <SidebarOption Icon={faMusic} option="Music" />
        </Link>

        <a style={{ textDecoration: "none", color: "white" }} href="/movies">
            <SidebarOption Icon={faFilm} option="Movies" />
        </a>
        
        <a style={{ textDecoration: "none", color: "white" }} href="/tv">
            <SidebarOption Icon={faTv} option="TV Shows" />
        </a>
        
        <a style={{ textDecoration: "none", color: "white" }} href="/podcasts">
            <SidebarOption Icon={faPodcast} option="Podcasts" />
        </a>
        
        <a style={{ textDecoration: "none", color: "white" }} href="/books">
            <SidebarOption Icon={faBook} option="Books" />
        </a>
        
        <a style={{ textDecoration: "none", color: "white" }} href="/comics">
            <SidebarOption Icon={faBook} option="Comics" />
        </a>
        
        <a style={{ textDecoration: "none", color: "white" }} href="/recently_added">
            <SidebarOption Icon={faFolderPlus} option="Recently Added" />
        </a>
        
        <a style={{ textDecoration: "none", color: "white" }} href="/my_list">
            <SidebarOption Icon={faList} option="My List" />
        </a>
        
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

const mapStateToProps = (state) => {
    return { playlists: state.playlists.playlists, };
};

export default connect(mapStateToProps)(SideBar);