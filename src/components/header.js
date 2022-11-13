import React, { useState } from "react";
// import { Link } from 'react-router-dom';

const Header = () => {

    const [ isNavOpen, setIsNavOpen ] = useState(false);

    const openNav = () => {
        setIsNavOpen(isNavOpen => !isNavOpen);
        console.log('switching nav', isNavOpen);
    }

    console.log('is nav open?', isNavOpen);

    return (
        <header>
            <nav className="navbar" id="navcontainer">
                <img id="logo" src={require("../img/stratabore-logo-transparent.png")} alt="Logo" />
                <div className={`other-nav ${isNavOpen ? "open" : ""}`}>
                    <a href="">Database</a>
                    <a href="">Calendar</a>
                    <a href="">Map</a>
                </div>
                <a href="" className="icon" onClick={openNav}>
                    <i className="fa fa-bars"></i>
                </a>
            </nav>
        </header>
    )
}

export default Header;