import React from 'react';

const Footer = ({ user, setUser, token, setToken }) => {

    const logOut = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem('userToken');
    }

    return (
        <footer>
            <div className="copyright-username">
                <p>&copy; 2022 StrataBore LLC</p>
                { !user ? null : (
                    <>
                    <p className="big-vert-line"></p>
                    <p>Logged in as: <span>{user.userName}</span></p>
                    <button onClick={logOut}>Log Out</button>
                    </>
                )}
            </div>
        </footer>
    )
}

export default Footer;