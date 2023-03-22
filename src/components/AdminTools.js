import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';

// tool component imports
import UserDatabase from './UserDatabase';
import RigDatabase from './RigDatabase';

// axios imports
import { getAllUsers, getAllRigs } from '../axios-services';

const AdminTools = ({token, user}) => {

  // this page will display the current user's information and allow them to edit it
  // users won't be able to see outright if they are admin, or edit this field at all, they have to be created as an admin
  // admins will see special tools below the account info

  // admin users will have a section where they can view all of the rigs and add/edit/update
  // (deleting as well, but that will need special error checking server side to prevent deleting rigs that are in use)
  // this rig section may be able to re-use much of the code for the database and jobforms

  console.log('current user', user);

  return (
    <>
      {
        user.isAdmin ? (
          <div className='admin-tools'>
            <UserDatabase token={token}/>
            <RigDatabase token={token}/>
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