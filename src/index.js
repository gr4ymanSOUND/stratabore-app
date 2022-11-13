import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';

const root = createRoot(document.getElementById('root'));

const App = () => {

  const [ isNavOpen, setIsNavOpen ] = useState(false);

    const openNav = () => {
      setIsNavOpen(isNavOpen => !isNavOpen);
    }
    console.log('is nav open?', isNavOpen);

  return (
    <>
      <header>
            <nav className="navbar" id="navcontainer">
                <img id="logo" src={require("./img/stratabore-logo-transparent.png")} alt="Logo" />
                <div className={`other-nav ${isNavOpen ? "open" : ""}`}>
                    <a href="">Database</a>
                    <a href="">Calendar</a>
                    <a href="">Map</a>
                </div>
                <div className="icon" onClick={openNav}>
                    <i className="fa fa-bars"></i>
                </div>
            </nav>
        </header>
    </>
  )
}

root.render(<App />);