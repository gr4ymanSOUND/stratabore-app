import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Header from './Header';
import Login from './Login';
import JobDatabase from './JobDatabase';
import Calendar from './Calendar';
import MapView from './MapView';
import ManagementTools from './ManagementTools';
import UserDatabase from './UserDatabase';
import RigDatabase from './RigDatabase';
import EditAccount from './EditAccount';
import DrillerView from './DrillerView';

import { getMe } from '../axios-services';

const App = () => {
  // state  and useEffect dealing with user details for logged in users
  const tokenFromStorage = localStorage.getItem('userToken');
  const [ token, setToken ] = useState(tokenFromStorage);
  const [ user, setUser ] = useState({});

  useEffect(() => {
    const getUserInfo = async () => {
      try {
        const userInfo = await getMe(token);
        // Only update state if the userInfo is different
        if (JSON.stringify(userInfo) !== JSON.stringify(user)) {
          setUser(userInfo);
        }
      } catch (error) {
        console.error('Error fetching user info:', error);
      }
    };
  
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
                token ? (
                user.isAdmin ? (
                  <Navigate to="/database" replace /> 
                ) : (
                  <Navigate to="/driller_view" replace />
                )
                ) : (
                  <Login token={token} setToken={setToken} setUser={setUser}/>
                )  
              } 
            />
            {/* Admin-Only Routes */}
            {user.isAdmin && (
              <>
                <Route
                  exact
                  path="/database"
                  element={<JobDatabase token={token} />}
                />
                <Route
                  exact
                  path="/calendar"
                  element={<Calendar token={token} />}
                />
                <Route
                  exact
                  path="/map"
                  element={<MapView token={token} />}
                />
                <Route
                  path="/management"
                  element={<ManagementTools />}
                >
                  <Route
                    index
                    element={<Navigate to="users" replace />}
                  />
                  <Route
                    path="users"
                    element={<UserDatabase token={token} user={user} />}
                  />
                  <Route
                    path="rigs"
                    element={<RigDatabase token={token} user={user} />}
                  />
                </Route>
              </>
            )}
            {/* Non-Admin Routes */}
            {!user.isAdmin && (
              <>
                {/* Future non-admin routes can be added here */}
                <Route
                  path="/driller_view"
                  element={<DrillerView token={token} user={user} />}
                />
              </>
            )}
            <Route
              path="/edit_account"
              element={<EditAccount token={token} user={user} setUser={setUser} />}
            /> 
            {/* Catch-All Route */}
            <Route
              path="*"
              element={<Navigate to="/" replace />}
            />
          </Routes>
    </BrowserRouter>
    
      </div>
    )
  }

export default App;