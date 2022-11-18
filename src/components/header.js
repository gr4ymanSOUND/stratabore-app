import React, { useState } from "react";
import { Link } from 'react-router-dom';

const Header = () => {

    const [ isNavOpen, setIsNavOpen ] = useState(false);
  
      const openNav = () => {
        setIsNavOpen(isNavOpen => !isNavOpen);
      }
      console.log('is nav open?', isNavOpen);

    return (
        <header>
            <nav className="navbar" id="navcontainer">
                <img id="logo" src={require("../img/stratabore-logo-transparent.png")} alt="Logo" />
                <div className={`other-nav ${isNavOpen ? "open" : ""}`}>
                    {/* <Link to="/database">Database</Link>
                    <Link to="/calendar">Calendar</Link>
                    <Link to="/map">Map</Link> */}
                    <a href="">Test</a>
                </div>
                <div className="icon" onClick={openNav}>
                    <i className="fa fa-bars"></i>
                </div>
            </nav>
        </header>
    )

    // return (
    //     <div>Another test</div>
    // )
}

export default Header;