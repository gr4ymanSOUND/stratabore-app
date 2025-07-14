import React, { useState, useEffect, useRef } from "react";
import { NavLink, useNavigate } from 'react-router-dom';

const HeaderMobile = ({ setUser, setToken }) => {
    const [isUserOpen, setIsUserOpen] = useState(false);
    const navigate = useNavigate();
    const userPopRef = useRef(null);


    const userPop = () => {
      setIsUserOpen(open => {
        return !open;
      });
    };
    const closePop = () => setIsUserOpen(false);

    const logOut = () => {
      setToken(null);
      setUser({});
      localStorage.removeItem('userToken');
      closePop();
      navigate('/');
    };

    // handles clicks outside the user pop to close it
    useEffect(() => {
        const handleClickOutside = (event) => {
            // If click is inside the pop or the button, do nothing
            if (
                userPopRef.current && userPopRef.current.contains(event.target)
            ) {
                return;
            }
            if (
                document.getElementById('mobile-user-icon') &&
                document.getElementById('mobile-user-icon').contains(event.target)
            ) {
                return;
            }
            closePop();
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);


    return (
        <nav className="mobile-bottom-nav">
            <NavLink
                className={({ isActive }) => (isActive ? "mobile-nav-active" : "mobile-nav-link")}
                title="Today's Details"
                to="/crew/todays_details"
            >
                <i className="fa-solid fa-tablet-screen-button"></i>
            </NavLink>
            <NavLink
                className={({ isActive }) => (isActive ? "mobile-nav-active" : "mobile-nav-link")}
                title='Crew Calendar'
                to="/crew/crew_calendar"
            >
                <i className="fa-regular fa-calendar-check"></i>
            </NavLink>
            <NavLink
                className={({ isActive }) => (isActive ? "mobile-nav-active" : "mobile-nav-link")}
                title='Rig Details'
                to="/crew/rig_details"
            >
                <i className="fa-solid fa-truck-field"></i>
            </NavLink>
            <div className="mobile-user-icon-wrap">
                <button 
                  id='mobile-user-icon'
                  title='User Account' 
                  onMouseDown={e => { 
                    e.stopPropagation();
                    userPop();
                  }}
                  className={isUserOpen ? "mobile-nav-active" : "mobile-nav-link"}
                >
                  <i className="fa-solid fa-user"></i>
                </button>
                <div
                  ref={userPopRef}
                  className={isUserOpen ? "mobile-user-pop open" : "mobile-user-pop"}
                  onClick={(e) => e.stopPropagation()}
                >
                  <button title='Log Out' onClick={logOut}>
                    <i className="fa-solid fa-right-from-bracket"></i>
                  </button>
                </div>
            </div>
        </nav>
    );
};

export default HeaderMobile;