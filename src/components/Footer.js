import React from 'react';

const Footer = ({ user, setUser, token, setToken }) => {

    const logOut = () => {
        setToken(null);
        setUser({});
        localStorage.removeItem('userToken');
    }

    return (
        <footer>
            <div className="copyright">
                <p>&copy; 2022 StrataBore LLC</p>
            </div>
        </footer>
    )
}

export default Footer;