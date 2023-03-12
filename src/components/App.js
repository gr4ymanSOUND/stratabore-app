import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Header from './Header';
import Login from './Login';
import Database from './Database';
import Footer from './Footer';

import { getMe } from '../axios-services';

const App = () => {
  // state  and useEffect dealing with user details for logged in users
  const tokenFromStorage = localStorage.getItem('userToken');
  const [ token, setToken ] = useState(tokenFromStorage);
  const [ user, setUser ] = useState({});

  useEffect(() => {
    const getUserInfo = async () => {
      const userInfo = await getMe(token);
      return setUser(userInfo);
    }
    if (token) {
      getUserInfo();
    }
  }, [token]);

  //contains the routes for each main page
    return (
        <BrowserRouter>
            <Header token={token}/>
              <Routes>
                  <Route 
                    exact path="/"
                    element={
                      token ? <Navigate to="/database" replace /> :
                      <Login token={token} setToken={setToken} setUser={setUser}/>
                    } 
                  />
                  <Route 
                    exact path="/database"
                    element={
                      !token ? <Navigate to="/" replace /> :
                      <Database token={token}/>
                    }
                  />
              </Routes>
            <Footer 
              user={user}
              setUser={setUser}
              setToken={setToken}
            />
        </BrowserRouter>
    )
  }

export default App;