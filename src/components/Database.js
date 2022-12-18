import React, { useState, useRef, useEffect, useMemo, useCallback} from 'react';
import JobForm from './JobForm';

// AG Grid imports
import { AgGridReact } from 'ag-grid-react'; // the AG Grid React Component
import 'ag-grid-community/styles/ag-grid.css'; // Core grid CSS, always needed
import 'ag-grid-community/styles/ag-theme-alpine.css'; // Optional theme CSS

// axios imports
import { getAllJobs } from '../axios-services/index';

const Database = ({ token }) => {

    const gridRef = useRef(); // Optional - for accessing Grid's API
    const [ jobList, setJobList ] = useState([]);
    const [ formType, setFormType ] = useState("");
    const [ currentSelected, setCurrentSelected ] = useState({});

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

     // Each Column Definition results in one Column.
    const [columnDefs, setColumnDefs] = useState([
        {field: 'jobNumber', filter: true},
        {field: 'location', filter: true},
        {field: 'numHoles'},
        {field: 'numFeet'},
        {field: 'rigId', filter: true}
    ]);

    // DefaultColDef sets props common to all Columns
    const defaultColDef = useMemo( ()=> ({
        sortable: true
    }));


    const rowSelectedListener = async (e) => {
        setCurrentSelected(e.data);
    }

    // Example using Grid's API
    const buttonListener = useCallback( e => {
        setFormType(e.target.id);
        
        if (e.target.id == "add-job") {
            gridRef.current.api.deselectAll();
            setCurrentSelected({});
        }
        
    }, []);

    const deleteListener = useCallback( e => {
        console.log('delete target', e.target);
        gridRef.current.api.deselectAll();
        setCurrentSelected({});
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


      console.log('jobs', jobList)
      console.log('current row', currentSelected);
    

    return (
        <div className='database'>
        
            {/* On div wrapping Grid a) specify theme CSS Class Class and b) sets Grid size */}
            <div className="ag-theme-alpine" style={{height: '100%', width: '100%'}}>
                <AgGridReact

                    ref={gridRef} // Ref for accessing Grid's API
            
                    rowData={jobList} // Row Data for Rows
            
                    columnDefs={columnDefs} // Column Defs for Columns
                    defaultColDef={defaultColDef} // Default Column Properties
            
                    animateRows={true} // Optional - set to 'true' to have rows animate when sorted
                    rowSelection='multiple' // Options - allows click selection of rows

                    onRowClicked={rowSelectedListener} // register row selection event

                    onGridReady={onGridReady}
                />
            </div>
            <div className='database-sidebar'>
                <div className='button-list' >
                    <button id='edit-job' onClick={buttonListener}>Edit Selected Job</button>
                    <button id='add-job' onClick={buttonListener}>Add Job</button>
                    {Object.keys(currentSelected).length !== 0 ? <button id='delete-job' onClick={deleteListener}>Delete Job</button> : null}
                </div>
                <div className='form-container'>
                    <JobForm token={token} formType={formType} setFormType={setFormType} jobList={jobList} setJobList={setJobList}/>
                </div>
            </div>
            
        </div>
      );

}

export default Database;