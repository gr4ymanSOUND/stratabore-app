import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Header from './Header';
import Login from './Login';
import JobDatabase from './JobDatabase';
import Calendar from './Calendar';
import MapView from './MapView';
// import Footer from './Footer';
import AdminTools from './AdminTools';
import UserDatabase from './UserDatabase';
import RigDatabase from './RigDatabase';
import EditSelf from './EditSelf';


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
      <div className='main-container'>

        <BrowserRouter>
            <Header 
              token={token}
              user={user}
              setUser={setUser}
              setToken={setToken}
            />
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
                      <JobDatabase token={token}/>
                    }
                  />
                  <Route 
                    exact path="/calendar"
                    element={
                      !token ? <Navigate to="/" replace /> :
                      <Calendar token={token}/>
                    }
                  />
                  <Route 
                    exact path="/map"
                    element={
                      !token ? <Navigate to="/" replace /> :
                      <MapView token={token}/>
                    }
                  />
                  <Route 
                    exact path="/admin"
                    element={
                      !token ? <Navigate to="/" replace /> :
                      <AdminTools/>
                    }
                  >
                    {/* Redirect from /admin to /admin/users */}
                    <Route 
                      index 
                      element={
                        user.isAdmin ? (
                          <Navigate to="users" replace />
                        ) : (
                          <Navigate to="editself" replace />
                        )
                      }
                    />
                    <Route 
                      path="users"
                      element={
                        !token ? <Navigate to="/" replace /> :
                        <UserDatabase token={token} user={user}/>
                      }
                    />
                    <Route 
                      path="rigs"
                      element={
                        !token ? <Navigate to="/" replace /> :
                        <RigDatabase token={token} user={user}/>
                      }
                    />
                    <Route 
                      path="editself"
                      element={
                        !token ? <Navigate to="/" replace /> :
                        <EditSelf token={token} user={user} setUser={setUser} />
                      }
                    />
                  </Route>
              </Routes>
            {/* <Footer 
              user={user}
              setUser={setUser}
              setToken={setToken}
            /> */}
        </BrowserRouter>
        
      </div>
    )
  }

export default App;