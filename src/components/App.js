import React, { useState } from 'react';
import { BrowserRouter, Routes, Route} from 'react-router-dom';

import Header from './Header';
import Login from './Login';
import Database from './Database';
import Footer from './Footer';


const App = () => {

    return (
        <BrowserRouter>
            <Header />
            <Routes>
                <Route exact path="/" element={<Login />} />
                <Route exact path="/database" element={<Database />} />
            </Routes>
            <Footer />
        </BrowserRouter>
  
    )
  }

export default App;