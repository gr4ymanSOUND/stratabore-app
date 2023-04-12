import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';

// tool component imports
import UserDatabase from './UserDatabase';
import RigDatabase from './RigDatabase';

// axios imports
import { getAllUsers, getAllRigs } from '../axios-services';

const AdminTools = ({token, user}) => {

  return (
    <>
      {
        user.isAdmin ? (
          <div className='admin-tools'>
            <div className='tool'>
              <UserDatabase token={token}/>
            </div>
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


// reminder: add 'status' field to job database, and change "delete" function to mark it as inactive instead
// that way no jobs are ever lost
// make another custom filter component for this column