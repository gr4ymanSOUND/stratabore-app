import React, { useState } from "react";
import { NavLink } from 'react-router-dom';

const Header = ({ user, setUser, token, setToken }) => {

    const [ isNavOpen, setIsNavOpen ] = useState(false);
    const [ isUserOpen, setIsUserOpen ] = useState(false);
  
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
        setIsUserOpen(isUserOpen => !isUserOpen)
      }

      const closePop = () => {
        setIsUserOpen(false);
      }

      console.log('user open?', isUserOpen)

    return (
        <header>
            <img id="logo" src={require("../img/stratabore-logo-transparent.png")} alt="Logo" />
            <nav className="navbar" id="navcontainer">
              {/* <img id="logo" src={require("../img/stratabore-logo-transparent.png")} alt="Logo" /> */}
              { !token ? null : (
                  <>
                  <div className={`other-nav ${isNavOpen ? "open" : ""}`}>
                      <NavLink 
                        className={({ isActive }) => (isActive ? "active" : "")}  
                        title='Database' 
                        to="/database"
                      >
                        <i className="fa-solid fa-list"></i>
                      </NavLink>
                      <NavLink
                        className={({ isActive }) => (isActive ? "active" : "")}
                        title='Calendar' 
                        to="/calendar"
                      >
                        <i className="fa-regular fa-calendar-check"></i>
                      </NavLink>
                      <NavLink 
                        className={({ isActive }) => (isActive ? "active" : "")}
                        title='Map View' 
                        to="/map"
                      >
                        <i className="fa-solid fa-map-location-dot"></i>
                      </NavLink>
                      { !user.isAdmin ? null : (
                        <NavLink 
                        className={({ isActive }) => (isActive ? "active" : "")}
                          title='Admin Settings' 
                          to="/admin"
                        >
                        <i className="fa-solid fa-gear"></i>                    
                      </NavLink>
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
                    <div className="user-footer">
                      <button id='user-icon' title={user.userName} onClick={userPop}>
                        <i className="fa-solid fa-user"></i>
                      </button>
                      <div className={isUserOpen ? "user-pop open" : "user-pop"}>
                        <NavLink className="username" to='/admin/editself'>
                          <div onClick={closePop}>{user.userName}</div>
                        </NavLink>
                        <button title='Log Out' onClick={logOut}>
                          <i className="fa-solid fa-right-from-bracket"></i>
                        </button>
                      </div>
                    </div>
                )}
              <p>&copy; 2022</p>
            </div>
        </header>
    )

}

export default Header;