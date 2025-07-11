import React, { useState, useEffect, useRef } from "react";
import { NavLink, useNavigate } from 'react-router-dom';

const HeaderMobile = ({ user, setUser, token, setToken }) => {
    const [isUserOpen, setIsUserOpen] = useState(false);
    const navigate = useNavigate();
    const userPopRef = useRef(null);

    const userPop = () => setIsUserOpen(open => !open);
    const closePop = () => setIsUserOpen(false);

    const logOut = () => {
      setToken(null);
      setUser({});
      localStorage.removeItem('userToken');
      closePop();
      navigate('/');
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (userPopRef.current && !userPopRef.current.contains(event.target)) {
                closePop();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        token && (
            <nav className="mobile-bottom-nav">
                <NavLink
                    className={({ isActive }) => (isActive ? "mobile-nav-active" : "mobile-nav-link")}
                    title="Today's Details"
                    to="/crew/todays_details"
                >
                    <i className="fa-solid fa-tablet-screen-button"></i>
                    <span>Today</span>
                </NavLink>
                <NavLink
                    className={({ isActive }) => (isActive ? "mobile-nav-active" : "mobile-nav-link")}
                    title='Crew Calendar'
                    to="/crew/crew_calendar"
                >
                    <i className="fa-regular fa-calendar-check"></i>
                    <span>Calendar</span>
                </NavLink>
                <NavLink
                    className={({ isActive }) => (isActive ? "mobile-nav-active" : "mobile-nav-link")}
                    title='Rig Details'
                    to="/crew/rig_details"
                >
                    <i className="fa-solid fa-truck-field"></i>
                    <span>Rigs</span>
                </NavLink>
                {user && Object.keys(user).length > 0 && (
                    <div className="mobile-user-footer">
                        <button id='mobile-user-icon' title='User Account' onClick={userPop}>
                            <i className="fa-solid fa-user"></i>
                        </button>
                        <div
                            ref={userPopRef}
                            className={isUserOpen ? "mobile-user-pop open" : "mobile-user-pop"}
                        >
                            <NavLink className="mobile-username" to='/edit_account' title="Edit Account" onClick={closePop}>
                                {user.userName}
                            </NavLink>
                            <button title='Log Out' onClick={logOut}>
                                <i className="fa-solid fa-right-from-bracket"></i>
                            </button>
                        </div>
                    </div>
                )}
            </nav>
        )
    );
};

export default HeaderMobile;