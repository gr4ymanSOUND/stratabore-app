import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Admin components
import Calendar from './admin/Calendar';
import JobDatabase from './admin/JobDatabase';
import ManagementTools from './admin/ManagementTools';
import MapView from './admin/MapView';
import RigDatabase from './admin/RigDatabase';
import UserDatabase from './admin/UserDatabase';

// Crew components
import CrewCalendar from './crew/CrewCalendar';
import TodayDetail from './crew/TodayDetail';
import RigDetails from './crew/RigDetails';

// Other components
import EditAccount from './EditAccount';
import Header from './Header';
import Login from './Login';

import { getMe } from '../axios-services';

const App = () => {
  // state  and useEffect dealing with user details for logged in users
  const tokenFromStorage = localStorage.getItem('userToken');
  const [ token, setToken ] = useState(tokenFromStorage);
  const [ user, setUser ] = useState({});
  const [loading, setLoading] = useState(false);

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
      <>
        {loading && (
          <div className="global-loading">
            <h2>Loading...</h2>
            {/* You can use a spinner here */}
          </div>
        )}
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
                    <Navigate to="/admin/database" replace /> 
                  ) : (
                    <Navigate to="/crew/todays_details" replace />
                  )
                  ) : (
                    <Login token={token} setToken={setToken} setUser={setUser} setLoading={setLoading} />
                  )  
                } 
              />
              {/* Admin-Only Routes */}
              {user.isAdmin && (
                <Route
                  path="/admin"
                >
                  <Route index element={<Navigate to="database" replace />} />
                  <Route
                    path="database"
                    element={<JobDatabase token={token} setLoading={setLoading} />}
                  />
                  <Route
                    path="calendar"
                    element={<Calendar token={token} setLoading={setLoading} />}
                  />
                  <Route
                    path="map"
                    element={<MapView token={token} setLoading={setLoading} />}
                  />
                  <Route
                    path="management"
                    element={<ManagementTools setLoading={setLoading} />}
                  >
                    <Route
                      index
                      element={<Navigate to="users" replace />}
                    />
                    <Route
                      path="users"
                      element={<UserDatabase token={token} user={user} setLoading={setLoading} />}
                    />
                    <Route
                      path="rigs"
                      element={<RigDatabase token={token} user={user} setLoading={setLoading} />}
                    />
                  </Route>
                </Route>
              )}
              {/* Non-Admin Routes */}
              {!user.isAdmin && (
                <Route
                  path='/crew'
                >
                  {/* Future non-admin routes can be added here */}
                  <Route
                    path="todays_details"
                    element={<TodayDetail token={token} user={user} setLoading={setLoading} />}
                  />
                  <Route
                    path="crew_calendar"
                    element={<CrewCalendar token={token} user={user} setLoading={setLoading} />}
                  />
                  <Route
                    path="rig_details"
                    element={<RigDetails token={token} user={user} setLoading={setLoading} />}
                  />
                </Route>
              )}
              <Route
                path="/edit_account"
                element={<EditAccount token={token} user={user} setUser={setUser} setLoading={setLoading} />}
              /> 
              {/* Catch-All Route */}
              <Route
                path="*"
                element={<Navigate to="/" replace />}
              />
            </Routes>
          </BrowserRouter>
        </div>
      </>
    )
  }

export default App;