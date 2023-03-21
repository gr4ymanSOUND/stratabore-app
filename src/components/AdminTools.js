import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';

// axios imports
import { getMe } from '../axios-services';

const AdminTools = ({token, user}) => {

  // useEffect(() => {

  // }, [])

  // this page will display the current user's information and allow them to edit it
  // users won't be able to see outright if they are admin, or edit this field at all, they have to be created as an admin
  // admins will see special tools below the account info

  // admin users will have a section where they can view all of the rigs and add/edit/update
  // (deleting as well, but that will need special error checking server side to prevent deleting rigs that are in use)
  // this rig section may be able to re-use much of the code for the database and jobforms

  console.log(user);

  return (
    <div className="admin-tools">
        <div className="account">
          <h2>Your Account Info:</h2>
            <div className="user-info">
                <div className="info-section">
                    <span>Your Name:</span>
                    <div className="info-content">{`${user.firstName} ${user.lastName}`}</div>
                </div>
                <div className="info-section">
                    <span>Username:</span>
                    <div className="info-content">{user.userName}</div>
                </div>
                <div className="info-section">
                    <span>Email:</span>
                    <div className="info-content">{user.email}</div>   
                </div>
                <div className="info-section">
                    <span>Admin:</span>
                    <div className="info-content">{ user.isAdmin ? 'Yes' : 'No' }</div>   
                </div>
            </div>
        </div>
        <div className='tools'>
          <div className='user-database'>
            <div>user list and form here</div>
            <div>no delete, only mark as inactive, make sure to add status field to db</div>
          </div>
          <div className='rig-database'>
            <div>rig list and form here</div>
            <div>no delete, only mark as inactive, make sure to add status field to db</div>
          </div>
        </div>
    </div>
)

};

export default AdminTools;


// reminder: add 'status' field to job database, and change "delete" function to mark it as inactive instead
// that way no jobs are ever lost
// make another custom filter component for this column