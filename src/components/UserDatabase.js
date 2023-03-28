import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';

import UserForm from './UserForm';

// AG Grid imports
import { AgGridReact } from 'ag-grid-react'; // the AG Grid React Component
import 'ag-grid-community/styles/ag-grid.css'; // Core grid CSS, always needed
import 'ag-grid-community/styles/ag-theme-alpine.css'; // Optional theme CSS

// axios imports
import { getAllUsers } from '../axios-services';

const UserDatabase = ({token}) => {
  //for accessing Grid's API
  const gridRef = useRef();

  // state for database contents , formtype, and currently selected row
  const [userList, setUserList] = useState([]);
  const [formType, setFormType] = useState("");
  const [currentSelected, setCurrentSelected] = useState({});

  // get user data
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const allUsers = await getAllUsers(token);
        setUserList(allUsers);
      } catch (error) {
        console.error(error);
      }
    }
    fetchUsers();
  }, []);

  // effect to deal with formtype changes
  useEffect(() => {
    if (formType == "add-user") {
      setCurrentSelected({});
      gridRef.current.api.deselectAll();
    }
    if (formType == "cancel" || formType == "reset") {
      setFormType("")
      const buttonTimeout = setTimeout(() => {
        gridRef.current.api.sizeColumnsToFit();
      })
    }
  }, [formType]);

  // Each Column Definition results in one Column.
  const [columnDefs, setColumnDefs] = useState([
    { headerName: 'User', field: 'userName', filter: true },
    { headerName: 'First Name', field: 'firstName', filter: true },
    { headerName: 'Last Name', field: 'lastName', filter: true },
    { headerName: 'Email', field: 'email', filter: true },
    { headerName: 'Admin', field: 'isAdmin', filter: true },
    { headerName: 'Status', field: 'status', filter: true }
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
    setFormType(e.target.id);
    const buttonResizeTrigger = setTimeout(() => {
      gridRef.current.api.sizeColumnsToFit();
    })
  }, []);

  // resizes the columns inside the grid to fit the grid/window size (is called when the grid/window gets resized)
  const onGridReady = useCallback((params) => {
    params.api.sizeColumnsToFit();
    window.addEventListener('resize', function () {
      setTimeout(function () {
        params.api.sizeColumnsToFit();
      });
    });
    gridRef.current.api.sizeColumnsToFit();
  }, []);

  return (
    <div className='user-database'>
      <div>All Users:</div>
      <div className='button-list' >
        {
          (formType == "edit-user" || formType == "add-user" || formType == "reset") ? <button id='cancel' className="cancel-button" onClick={buttonListener}>Cancel</button>
          :
            <>
              {Object.keys(currentSelected).length !== 0 ? <button id='edit-user' onClick={buttonListener}>Edit Selected User</button> : null}
              <button id='add-user' onClick={buttonListener}>Add User</button>
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
