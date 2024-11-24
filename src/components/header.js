import React, { useState } from "react";
import { Link } from 'react-router-dom';

const Header = ({token}) => {

    const [ isNavOpen, setIsNavOpen ] = useState(false);
  
      const openNav = () => {
        setIsNavOpen(isNavOpen => !isNavOpen);
      }

    return (
        <header>
            <nav className="navbar" id="navcontainer">
                <img id="logo" src={require("../img/stratabore-logo-transparent.png")} alt="Logo" />
                { !token ? null : (
                    <>
                    <div className={`other-nav ${isNavOpen ? "open" : ""}`}>
                        <Link to="/database">Job List</Link>
                        <Link to="/calendar">Calendar</Link>
                        <Link to="/map">
                        <i class="fa-solid fa-map-location-dot"></i>
                        </Link>
                        <Link to="/admin">Admin</Link>
                    </div>
                    <div className="icon" onClick={openNav}>
                        <i className="fa fa-bars"></i>
                    </div>
                    </>
                    )
                }
            </nav>
        </header>
    )

}

export default Header;