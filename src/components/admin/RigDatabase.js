import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';

import RigForm from './RigForm';
import customFilter from './CustomFilter';

// AG Grid imports
import { AgGridReact } from 'ag-grid-react'; // the AG Grid React Component
import 'ag-grid-community/styles/ag-grid.css'; // Core grid CSS, always needed
import 'ag-grid-community/styles/ag-theme-alpine.css'; // Optional theme CSS

// axios imports
import { getAllRigs } from '../../axios-services';

// importing CSV download helpers
import Papa from 'papaparse';
import FileSaver from 'file-saver';

const RigDatabase = ({token, user}) => {
  //for accessing Grid's API
  const gridRef = useRef();

  // state for database contents , formtype, and currently selected row
  const [rigList, setRigList] = useState([]);
  const [formType, setFormType] = useState("");
  const [currentSelected, setCurrentSelected] = useState({});

  // get rig data
  useEffect(() => {
    const fetchRigs = async () => {
      try {
        const allRigs = await getAllRigs(token);
        setRigList(allRigs);
      } catch (error) {
        console.error(error);
      }
    }
    fetchRigs();
  }, []);

  // effect to deal with formtype changes
  useEffect(() => {
    if (formType == "add-rig") {
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
    { headerName: 'Rig ID', field: 'id' },
    { headerName: 'Plate', field: 'licensePlate', filter: true },
    { headerName: 'Type', field: 'rigType',
      filter: customFilter, filterParams: {values: ['lil', 'mid', 'big']} },
    { headerName: 'Color', field: 'boardColor', filter: true },
    { headerName: 'Registration Due', field: 'registrationDueDate', filter: true},
    { headerName: 'Maintenance Due', field: 'maintenanceDueDate', filter: true},
    { headerName: 'Notes', field: 'notes', filter: true },
    { headerName: 'Status', field: 'status',
      filter: customFilter, filterParams: {values: ['active', 'repairs', 'inactive']} }
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

    //download the rig list
    const downloadRigList = async (e) => {
      const d = new Date();
      let dateString = `${d.getFullYear()}-${d.getUTCMonth() + 1}-${d.getDate()}`
  
      const csvFileData = Papa.unparse(rigList);
      const blob = new Blob([csvFileData], { type: 'text/csv;charset=utf-8' });
      FileSaver.saveAs(blob, `StrataBore_rigList_${dateString}.csv`);
  
    }

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
    <div className='rig-database'>
      <div className='button-list' >
        {
          (formType == "edit-rig" || formType == "add-rig" || formType == "reset") ? <button id='cancel' className="cancel-button" onClick={buttonListener}>Cancel</button>
          :
            <>
              {Object.keys(currentSelected).length !== 0 ? (
                <button id='edit-rig' onClick={buttonListener} title='Edit'>
                  <i id='edit-rig' className="fa-solid fa-pen-to-square"></i>
                </button>
                ) : null
              }
              <button id='add-rig' onClick={buttonListener} title='Add'>
                <i id='add-rig' className="fa-solid fa-plus"></i>
              </button>
              <button id='download-list' onClick={downloadRigList} title='Download'>
                <i className="fa-solid fa-file-arrow-down"></i>
              </button>
            </>
        }
      </div>
      <div className='admin-table'>
        <div className="ag-theme-alpine" style={{ height: '100%', width: '100%' }}>
          <AgGridReact
            ref={gridRef} // Ref for accessing Grid's API
            rowData={rigList} // Row Data
            columnDefs={columnDefs} // Column Defs
            defaultColDef={defaultColDef} // Default Column Properties
            animateRows={true} // Optional - set to 'true' to have rows animate when sorted
            rowSelection='single' // Options - allows click selection of rows
            onRowClicked={rowSelectedListener} // register row selection event
            onGridReady={onGridReady}
          />
        </div>
        <div className='data-form'>
          <RigForm
            token={token}
            formType={formType}
            setFormType={setFormType}
            currentSelected={currentSelected}
            setCurrentSelected={setCurrentSelected}
            rigList={rigList}
            setRigList={setRigList}
          />
        </div>
      </div>
    </div>
  )
}

export default RigDatabase;
