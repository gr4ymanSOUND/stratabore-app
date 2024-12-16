import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import JobForm from './JobForm';
import customFilter from './CustomFilter';

// AG Grid imports
import { AgGridReact } from 'ag-grid-react'; // the AG Grid React Component
import 'ag-grid-community/styles/ag-grid.css'; // Core grid CSS, always needed
import 'ag-grid-community/styles/ag-theme-alpine.css'; // Optional theme CSS

// axios imports
import { getAllJobs, getAssignedAndUnassignedJobs } from '../axios-services/index';
import { CHART_TOOL_PANEL_ALLOW_LIST } from 'ag-grid-community';

// importing CSV download helpers
import Papa from 'papaparse';
import FileSaver from 'file-saver';


const JobDatabase = ({ token }) => {
  //for accessing Grid's API
  const gridRef = useRef();

  // state for database contents , formtype, and currently selected row
  const [jobList, setJobList] = useState([]);
  const [formType, setFormType] = useState("");
  const [currentSelected, setCurrentSelected] = useState({});

  // get all the jobs when the page loads
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const jobs = await getAssignedAndUnassignedJobs(token);
        setJobList(jobs);
      } catch (error) {
        console.error(error);
      }
    }
    fetchJobs();
  }, []);

  // effect to deal with formtype changes
  useEffect(() => {
    if (formType == "add-job") {
      setCurrentSelected({});
      gridRef.current.api.deselectAll();
    }
    if (formType == "cancel" || formType == "reset" || formType == "unassigned") {
      setFormType("")
      const buttonTimeout = setTimeout(() => {
        gridRef.current.api.sizeColumnsToFit();
      })
    }
  }, [formType]);

  // Each Column Definition results in one Column.
  const [columnDefs, setColumnDefs] = useState([
    { headerName: 'Job #',field: 'jobNumber', filter: true, minWidth: 100, width: 100},
    { field: 'client',
      filter: customFilter, filterParams: {values: ['EWL', 'TER', 'AAA', 'ZZZ']},
      minWidth: 90, width: 90},
    { field: 'location', filter: true },
    { headerName: 'Holes', field: 'numHoles', width: 70 },
    { headerName: '# Ft', field: 'numFeet', width: 70 },
    { headerName: 'Length', field: 'jobLength', filter: true, width: 80},
    { headerName: 'Book Date', field: 'createdDate', filter: true, width: 100 },
    { headerName: 'Drill Date', field: 'jobDate', filter: true, minWidth: 110,width: 110 },
    { headerName: 'Rig', field: 'rigId', filter: true, width: 60},
    { headerName: 'Status', field: 'status',
      filter: customFilter, filterParams: {values: ['pending', 'completed', 'canceled']},
      width: 100 }
  ]);

  // DefaultColDef sets props common to all Columns
  const defaultColDef = useMemo(() => ({
    sortable: true,
  }));

  // sets the currently selected row into React State
  const rowSelectedListener = async (e) => {
    setCurrentSelected(e.data);
  }

  // sets the formType when any button is clicked
  // also resizes the grid to show all columns when the form is added/removed in the sidebar
  const buttonListener = useCallback((e) => {
    console.log('button clicked', e.target.id)
    setFormType(e.target.id);
    const buttonResizeTrigger = setTimeout(() => {
      gridRef.current.api.sizeColumnsToFit();
    })
  }, []);

  // 
  const downloadJobList = async (e) => {
    const d = new Date();
    let dateString = `${d.getFullYear()}-${d.getUTCMonth() + 1}-${d.getDate()}`

    const csvFileData = Papa.unparse(jobList);
    const blob = new Blob([csvFileData], { type: 'text/csv;charset=utf-8' });
    FileSaver.saveAs(blob, `StrataBore_jobList_${dateString}.csv`);

  }

  // resizes the columns inside the grid to fit the grid/window size (is called when the grid/window gets resized)
  const onGridReady = useCallback((params) => {
    gridRef.current.api.sizeColumnsToFit();
    window.addEventListener('resize', function () {
      setTimeout(function () {
        params.api.sizeColumnsToFit();
      });
    });
  }, []);

  // only run this if there is a "currentSelected", but run it after the final render every time
  // // have to do this so late because only the final re-render seems to capture updated job numbers in state properly for this to access it

  if (currentSelected.jobNumber) {
    const timer = setTimeout(() => {
      gridRef.current.api.forEachNode(function (node) {
        node.setSelected(node.data.jobNumber === currentSelected.jobNumber);
      });
    })
  }

  return (
    <div className='database'>
      <div className='button-list' >
        {
          (formType == "edit-job" || formType == "add-job" || formType == "reset") ? <button id='cancel' className="cancel-button" onClick={buttonListener}>Cancel</button>
          :
            <>
              {
                Object.keys(currentSelected).length !== 0 ? (
                    <button id='edit-job' onClick={buttonListener}>
                      <i id='edit-job' className="fa-solid fa-pen-to-square"></i>
                    </button>
                ) : null
              }
              <button id='add-job' onClick={buttonListener}>
                <i id='add-job' className="fa-solid fa-plus"></i>
              </button>
              <button id='download-list' onClick={downloadJobList}>
                <i className="fa-solid fa-file-arrow-down"></i>
              </button>
            </>
        }
      </div>
      <div className='job-table'>
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
            setCurrentSelected={setCurrentSelected}
          />
        </div>
      </div>
    </div>
  );
}

export default JobDatabase;