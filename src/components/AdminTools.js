import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';

// tool component imports
import UserDatabase from './UserDatabase';
import RigDatabase from './RigDatabase';

// axios imports
import { getAllUsers, getAllRigs } from '../axios-services';

const AdminTools = ({token, user}) => {


  // add a top bar to choose between tools: all users, rigs, and reports
  // potentially move button bar for each tool to this page
  // create reports component to use later
  
  return (
    <>
      {
        user.isAdmin ? (
          <div className='admin-tools'>
            <i className="fa-solid fa-users"></i>
            <div className='tool'>
              <UserDatabase token={token}/>
            </div>
            <i className="fa-solid fa-truck-field"></i>
            <div className='tool'>
              <RigDatabase token={token}/>
            </div>
          </div>
        ) : null
      }
    </>
)

};

export default AdminTools;