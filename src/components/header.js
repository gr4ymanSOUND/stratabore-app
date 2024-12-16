import React, { useState } from "react";
import { Link } from 'react-router-dom';

const Header = ({ user, setUser, token, setToken }) => {

    const [ isNavOpen, setIsNavOpen ] = useState(false);
  
      const openNav = () => {
        setIsNavOpen(isNavOpen => !isNavOpen);
      }

      const logOut = () => {
        setToken(null);
        setUser({});
        localStorage.removeItem('userToken');
      }

      const userPop = () => {
        console.log('user icon click');
      }

    return (
        <header>
            <img id="logo" src={require("../img/stratabore-logo-transparent.png")} alt="Logo" />
            <nav className="navbar" id="navcontainer">
              {/* <img id="logo" src={require("../img/stratabore-logo-transparent.png")} alt="Logo" /> */}
              { !token ? null : (
                  <>
                  <div className={`other-nav ${isNavOpen ? "open" : ""}`}>
                      <Link title='Database' to="/database">
                        <i className="fa-solid fa-list"></i>
                      </Link>
                      <Link title='Calendar' to="/calendar">
                        <i className="fa-regular fa-calendar-check"></i>
                      </Link>
                      <Link title='Map View' to="/map">
                        <i className="fa-solid fa-map-location-dot"></i>
                      </Link>
                      { !user.isAdmin ? null : (
                        <Link title='Admin Settings' to="/admin">
                        <i className="fa-solid fa-gear"></i>                    
                      </Link>
                      )}
                  </div>
                  <div className="icon" onClick={openNav}>
                      <i className="fa fa-bars"></i>
                  </div>
                  </>
                  )
              }
            </nav>
            <div className="side-footer">
                { !Object.keys(user).length ? null : (
                    <>
                    <button id='footer-user' title={user.userName} onClick={userPop}>
                      <i className="fa-solid fa-user"></i>
                    </button>
                    <button title='Log Out' onClick={logOut}>
                      <i className="fa-solid fa-right-from-bracket"></i>
                    </button>
                    </>
                )}
              <p>&copy; 2022</p>
            </div>
        </header>
    )

}

export default Header;