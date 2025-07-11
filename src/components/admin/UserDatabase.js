import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';

import UserForm from './UserForm';
import customFilter from './CustomFilter';


// AG Grid imports
import { AgGridReact } from 'ag-grid-react'; // the AG Grid React Component
import 'ag-grid-community/styles/ag-grid.css'; // Core grid CSS, always needed
import 'ag-grid-community/styles/ag-theme-alpine.css'; // Optional theme CSS

// axios imports
import { getAllUsers } from '../../axios-services';

// importing CSV download helpers
import Papa from 'papaparse';
import FileSaver from 'file-saver';

const UserDatabase = ({token, user, setLoading}) => {
  //for accessing Grid's API
  const gridRef = useRef();

  // state for database contents , formtype, and currently selected row
  const [userList, setUserList] = useState([]);
  const [formType, setFormType] = useState("");
  const [currentSelected, setCurrentSelected] = useState({});

  // get user data
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const allUsers = await getAllUsers(token);
        setUserList(allUsers);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchUsers();
  }, []);

  // effect to deal with formtype changes
  useEffect(() => {
    let timeoutId;
    if (formType === "add-user") {
      setCurrentSelected({});
      if (gridRef.current && gridRef.current.deselectAll) {
        gridRef.current.deselectAll();
      }
    }
    timeoutId = setTimeout(() => {
      if (gridRef.current && gridRef.current.sizeColumnsToFit) {
        gridRef.current.sizeColumnsToFit();
      }
    });
    return () => clearTimeout(timeoutId);
  }, [formType]);

  // Each Column Definition results in one Column.
  const [columnDefs, setColumnDefs] = useState([
    { headerName: 'User', field: 'userName', filter: true },
    { headerName: 'First Name', field: 'firstName', filter: true },
    { headerName: 'Last Name', field: 'lastName', filter: true },
    { headerName: 'Email', field: 'email', filter: true },
    { headerName: 'Rig ID', field: 'rigId', filter: true },
    { headerName: 'Admin', field: 'isAdmin',
      filter: customFilter, filterParams: {values: ['true', 'false']} },
    { headerName: 'Status', field: 'status',
      filter: customFilter, filterParams: {values: ['active', 'inactive']} }
    
  ]);

  // DefaultColDef sets props common to all Columns
  const defaultColDef = useMemo(() => ({
    sortable: true
  }));

  // sets the currently selected row into React State
  const rowSelectedListener = async (e) => {
    setCurrentSelected(e.data);
  }

  // sets the formType when any button is clicked
  // also resizes the grid to show all columns when the form is added/removed in the sidebar
  const buttonListener = useCallback((e) => {
    if (e.target.id == "cancel" || e.target.id == "reset") {
      setFormType("");
    } else {
      setFormType(e.target.id);
    }
  }, []);

  //download the user list
  const downloadUserList = async (e) => {
    const d = new Date();
    let dateString = `${d.getFullYear()}-${d.getUTCMonth() + 1}-${d.getDate()}`

    const csvFileData = Papa.unparse(userList);
    const blob = new Blob([csvFileData], { type: 'text/csv;charset=utf-8' });
    FileSaver.saveAs(blob, `StrataBore_userList_${dateString}.csv`);

  }

  // resizes the columns inside the grid to fit the grid/window size (is called when the grid/window gets resized)
  const onGridReady = useCallback((params) => {
    params.api.sizeColumnsToFit();
    gridRef.current = params.api;
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (gridRef.current && gridRef.current.sizeColumnsToFit) {
        gridRef.current.sizeColumnsToFit();
      }
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);


  return (
    <div className='user-database'>
      <div className='button-list' >
        {
          (formType == "edit-user" || formType == "add-user") ? <button id='cancel' className="cancel-button" onClick={buttonListener}>Cancel Editing</button>
          :
            <>
              {Object.keys(currentSelected).length !== 0 ? (
                <button id='edit-user' onClick={buttonListener} title='Edit'>
                  <i id='edit-user' className="fa-solid fa-pen-to-square"></i>
                </button>
                ) : null
              }
              <button id='add-user' onClick={buttonListener} title='Add'>
                <i id='add-user' className="fa-solid fa-plus"></i>
              </button>
              <button id='download-list' onClick={downloadUserList} title='Download'>
                <i className="fa-solid fa-file-arrow-down"></i>
              </button>
            </>
        }
      </div>
      <div className='admin-table'>
        <div className="ag-theme-alpine" style={{ height: '100%', width: '100%' }}>
          <AgGridReact
            ref={gridRef} // Ref for accessing Grid's API
            rowData={userList} // Row Data
            columnDefs={columnDefs} // Column Defs
            defaultColDef={defaultColDef} // Default Column Properties
            animateRows={true} // Optional - set to 'true' to have rows animate when sorted
            rowSelection='single' // Options - allows click selection of rows
            onRowClicked={rowSelectedListener} // register row selection event
            onGridReady={onGridReady}
          />
        </div>
        <div className='data-form'>
          <UserForm 
            token={token}
            formType={formType}
            setFormType={setFormType}
            currentSelected={currentSelected}
            setCurrentSelected={setCurrentSelected}
            setUserList={setUserList}
          />
        </div>
      </div>
    </div>
  )
}

export default UserDatabase;
