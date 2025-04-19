import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { Link, NavLink, Outlet} from 'react-router-dom';

// tool component imports
import UserDatabase from './UserDatabase';
import RigDatabase from './RigDatabase';

// axios imports
import { getAllUsers, getAllRigs } from '../axios-services';

const AdminTools = ({token, user}) => {

  const [whichTool, setWhichTool] = useState("usertool");
  // add a top bar to choose between tools: all users, rigs, and reports
  // potentially move button bar for each tool to this page
  // create reports component to use later

  const toolSelectButton = useCallback((e) => {
    console.log('tool clicked', e.target.id, e.target.className);
    setWhichTool(e.target.id);
  }, []);
  
  return (
    <>
    <div className='admin-tools'>

      <div className="button-list tool-selector">
        <NavLink 
          className={({ isActive }) => (isActive ? "active" : "")}
          to='/admin/users'
        >
          <i id='usertool' className="fa-solid fa-users"></i>
        </NavLink>
        <NavLink 
          className={({ isActive }) => (isActive ? "active" : "")}
          to='/admin/rigs'
        >
          <i id='rigtool' className="fa-solid fa-truck-field"></i>
        </NavLink>
      </div>

{/* 
      <div className="button-list tool-selector">
        <Link to='/admin/users'>
          <i id='usertool' className="fa-solid fa-users"></i>
        </Link>
        <Link to='/admin/rigs'>
          <i id='rigtool' className="fa-solid fa-truck-field"></i>
        </Link>
      </div> */}

      <div className='tool'>
        <Outlet />
      </div>
    </div>
    </>
)

};

export default AdminTools;