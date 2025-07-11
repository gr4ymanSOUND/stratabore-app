import React, { useState, useEffect, useRef } from "react";
import { NavLink, useNavigate } from 'react-router-dom';

const Header = ({ user, setUser, token, setToken }) => {

    const [ isNavOpen, setIsNavOpen ] = useState(false);
    const [ isUserOpen, setIsUserOpen ] = useState(false);
    const navigate = useNavigate();
    const userPopRef = useRef(null);
  
    const userPop = () => {
      setIsUserOpen(isUserOpen => !isUserOpen)
    }

    const closePop = () => {
      setIsUserOpen(false);
    }

    const openNav = () => {
      setIsNavOpen(isNavOpen => !isNavOpen);
    }

    const logOut = () => {
      setToken(null);
      setUser({});
      localStorage.removeItem('userToken');
      closePop();
      navigate('/');
    }

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (userPopRef.current && !userPopRef.current.contains(event.target)) {
                closePop();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);
      
    return (
        <header>
          <img id="logo" src={require("../../img/stratabore-logo-transparent.png")} alt="Logo" />
          <nav className="navbar" id="navcontainer">
            { !token ? null : (
                <>
                <div className='other-nav'>
                  <div className={`other-nav ${isNavOpen ? "open" : ""}`}>
                    <NavLink 
                      className={({ isActive }) => (isActive ? "active" : "")}  
                      title='Database' 
                      to="/admin/database"
                    >
                      <i className="fa-solid fa-list"></i>
                    </NavLink>
                    <NavLink
                      className={({ isActive }) => (isActive ? "active" : "")}
                      title='Calendar' 
                      to="/admin/calendar"
                    >
                      <i className="fa-regular fa-calendar-check"></i>
                    </NavLink>
                    <NavLink 
                      className={({ isActive }) => (isActive ? "active" : "")}
                      title='Map View' 
                      to="/admin/map"
                    >
                      <i className="fa-solid fa-map-location-dot"></i>
                    </NavLink>
                    <NavLink 
                      className={({ isActive }) => (isActive ? "active" : "")}
                      title='Managment Tools' 
                      to="/admin/management"
                    >
                      <i className="fa-solid fa-gear"></i>                    
                    </NavLink>
                </div>
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
                      <button id='user-icon' title='User Account' onClick={userPop}>
                        <i className="fa-solid fa-user"></i>
                      </button>
                      <div
                        ref={userPopRef} 
                        className={isUserOpen ? "user-pop open" : "user-pop"}
                      >
                        <NavLink className="username" to='/edit_account' title="Edit Account">
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