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

  // effect to un-select the row when the form type changes to "add" or ""
  useEffect(() => {
    if (formType == "add-job" || formType == "reset") {
      setCurrentSelected({});
      gridRef.current.api.deselectAll();

      formType == "reset" ? setFormType("") : null
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

  // Example using Grid's API
  // sets the formType when the add or edit button is clicked
  const buttonListener = useCallback(e => {
    setFormType(e.target.id);
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
      <div className='database-sidebar'>
        {
          formType ? null :
            <div className='button-list' >
              <button id='add-job' onClick={buttonListener}>Add Job</button>
              {Object.keys(currentSelected).length !== 0 ? <button id='edit-job' onClick={buttonListener}>Edit Selected Job</button> : null}
            </div>
        }
        <div className='form-container'>
          <JobForm
            gridRef={gridRef}
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