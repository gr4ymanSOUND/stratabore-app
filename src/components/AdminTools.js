import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';

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
        <button id='usertool' className='tool-button' onClick={toolSelectButton}>
          <i id='usertool' className="fa-solid fa-users"></i>
        </button>
        <button className='tool-button' id='rigtool' onClick={toolSelectButton}>
          <i id='rigtool' className="fa-solid fa-truck-field"></i>
        </button>
      </div>
      <div className='tool'>
        {
          whichTool == "usertool" ? (
                <UserDatabase token={token}/>
          ) : (
                <RigDatabase token={token}/>
          )
        }
        </div>
    </div>
    </>
)

};

export default AdminTools;