import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { Link, NavLink, Outlet} from 'react-router-dom';


const AdminTools = () => {
  // create reports component to use later
  
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


      <div className='tool'>
        <Outlet />
      </div>
    </div>
    </>
)

};

export default AdminTools;