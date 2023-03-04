import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import JobForm from './JobForm';

// AG Grid imports
import { AgGridReact } from 'ag-grid-react'; // the AG Grid React Component
import 'ag-grid-community/styles/ag-grid.css'; // Core grid CSS, always needed
import 'ag-grid-community/styles/ag-theme-alpine.css'; // Optional theme CSS

// axios imports
import { getAllJobs } from '../axios-services/index';

const Database = ({ token }) => {

  const gridRef = useRef(); // Optional - for accessing Grid's API
  const [jobList, setJobList] = useState([]);
  const [formType, setFormType] = useState("");
  const [currentSelected, setCurrentSelected] = useState({});

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const jobs = await getAllJobs(token);
        setJobList(jobs);

      } catch (error) {
        console.log(error);
      }
    }
    fetchJobs();
  }, [])

  // effect to deal with formtype changes
  useEffect(() => {
    if (formType == "add-job") {
      setCurrentSelected({});
      gridRef.current.api.deselectAll();
    }

    if (formType == "cancel" || formType == "reset") {
      setFormType("")
      const buttonTimeout = setTimeout(() => {
        gridRef.current.api.sizeColumnsToFit();
      })
    }

  }, [formType])


  // Each Column Definition results in one Column.
  const [columnDefs, setColumnDefs] = useState([
    { field: 'jobNumber', filter: true },
    { field: 'location', filter: true },
    { field: 'numHoles' },
    { field: 'numFeet' },
    { field: 'rigId', filter: true }
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

  // a few sanity check console.logs
  console.log('form type', formType)
  console.log('jobs', jobList)
  console.log('current row', currentSelected);


  return (
    <div className='database'>
      <div className='button-list' >
        {
          (formType == "edit-job" || formType == "add-job" || formType == "reset") ? <button id='cancel' className="cancel-button" onClick={buttonListener}>Cancel</button>
          :
            <>
              {Object.keys(currentSelected).length !== 0 ? <button id='edit-job' onClick={buttonListener}>Edit Selected Job</button> : null}
              <button id='add-job' onClick={buttonListener}>Add Job</button>
            </>
        }
      </div>
      <div className='data-table'>
        <div className="ag-theme-alpine" style={{ height: '100%', width: '100%' }}>
          <AgGridReact
            ref={gridRef} // Ref for accessing Grid's API
            rowData={jobList} // Row Data
            columnDefs={columnDefs} // Column Defs
            defaultColDef={defaultColDef} // Default Column Properties
            animateRows={true} // Optional - set to 'true' to have rows animate when sorted
            rowSelection='single' // Options - allows click selection of rows
            onRowClicked={rowSelectedListener} // register row selection event
            onGridReady={onGridReady}
          />
        </div>
        <div className='data-form'>
          <JobForm
            token={token}
            formType={formType}
            setFormType={setFormType}
            jobList={jobList}
            setJobList={setJobList}
            currentSelected={currentSelected}
            setCurrentSelected={setCurrentSelected} />
        </div>
      </div>
    </div>
    
  );
}

export default Database;