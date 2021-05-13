import React, { useEffect, useRef, useState, useContext } from 'react';
import SearchContext from "../Search/context"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch, faGift, faBell } from '@fortawesome/free-solid-svg-icons'
import logo from "../../assets/netflix-2.svg"


function Header() {

    const [pinHeader, setHeader] = useState(false)
    const [searchBox, setSearchBox] = useState(false)
    const ref = useRef(null)
    const inputRef = useRef(null)

    const { searchInput, updateSearchInput } = useContext(SearchContext)


    const handleScroll = () => {

        if (window.scrollY === 0) {
            setHeader(false);
        } else if (ref && ref.current && ref.current.getBoundingClientRect()) {
            setHeader(ref.current.getBoundingClientRect().top <= 0);
        }

    };


    const toggleSearchBox = () => {

        if (!searchBox && inputRef.current) inputRef.current.focus();

        setSearchBox(prevState => !prevState)

    }


    useEffect(() => {
        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', () => handleScroll);
        };
    }, []);


    return (
        <div className="header-height-pinned">


            <div className={`header ${pinHeader ? 'pin-header' : ''}`} ref={ref}>
                <div className="logo">
                    <img src={logo} alt={"logo"} />
                </div>

                <div className="header-menu">
                    <ul className="header-list">
                        <li className="header-list-item menu-trigger">
                            <a href={"/"} className="navigation-menu active">Menu</a>
                            <div className="submenu">
                                <div className="arrow"></div>
                                <div className="topbar"></div>
                                <ul>
                                    <li><a href={"/"} className="active">Home</a></li>
                                    <li><a href={"/"}>TV shows</a></li>
                                    <li><a href={"/"}>Movies</a></li>
                                    <li><a href={"/"}>Recently added</a></li>
                                    <li><a href={"/"}>My list</a></li>
                                </ul>
                            </div>
                        </li>
                        <li className="header-list-item"><a href={"/"} className="active">Home</a></li>
                        <li className="header-list-item"><a href={"/"}>TV shows</a></li>
                        <li className="header-list-item"><a href={"/"}>Movies</a></li>
                        <li className="header-list-item"><a href={"/"}>Recently added</a></li>
                        <li className="header-list-item"><a href={"/"}>My list</a></li>
                    </ul>
                </div>


                <div className="header-options">
                    <div className={`${searchBox ? "searchBox" : "searchIcon"}`}>
                        <span className="icon" onClick={() => toggleSearchBox()}><FontAwesomeIcon icon={faSearch} /></span>
                        <input className="searchInput"
                            ref={inputRef}
                            value={searchInput}
                            onChange={(e) => updateSearchInput(e.currentTarget.value)}
                            onBlur={() => setSearchBox(false)}
                            type="text" placeholder="Titles, People, Genres..." maxLength="80" />
                    </div>
                    <div><span className="icon"><FontAwesomeIcon icon={faGift} /></span></div>
                    <div><span className="icon"><FontAwesomeIcon icon={faBell} /></span></div>
                    <div className="account-menu">
                        <div className="account-dropdown-menu">
                            <span className="presentation">
                                <img src={"https://occ-0-2692-360.1.nflxso.net/dnm/api/v6/Z-WHgqd_TeJxSuha8aZ5WpyLcX8/AAAABWyw3UeUMaPP3aLxzskg3Bn5htGHqQymxiEGTbfM91FZ0zJAPoEfYQdvHW7FV06FcdXhPC_4F7zNR7TFKLLv6yo.png?r=88c"} alt={"avatar"} />
                            </span>
                            <span className="caret"></span>
                        </div>

                    </div>
                </div>

            </div>
        </div>
    );
}

export default Header;
