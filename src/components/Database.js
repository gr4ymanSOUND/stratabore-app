import React, { useState, useRef, useEffect, useMemo, useCallback} from 'react';

// AG Grid imports
import { AgGridReact } from 'ag-grid-react'; // the AG Grid React Component
import 'ag-grid-community/styles/ag-grid.css'; // Core grid CSS, always needed
import 'ag-grid-community/styles/ag-theme-alpine.css'; // Optional theme CSS

// axios imports
import { getAllJobs } from '../axios-services/index';

const Database = ({ token }) => {

    const gridRef = useRef(); // Optional - for accessing Grid's API
    const [ jobList, setJobList ] = useState([]);

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
    console.log('jobs', jobList)

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

    // Example of consuming Grid Event
    const cellClickedListener = useCallback( event => {
        console.log('cellClicked', event);
    }, []);

    // Example using Grid's API
    const buttonListener = useCallback( e => {
        gridRef.current.api.deselectAll();
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
        <div className='database'>
     
            {/* Example using Grid's API */}
            <button onClick={buttonListener}>Push Me</button>
        
            {/* On div wrapping Grid a) specify theme CSS Class Class and b) sets Grid size */}
            <div className="ag-theme-alpine" style={{width: '100%', height: '100%'}}>
        
            <AgGridReact

                ref={gridRef} // Ref for accessing Grid's API
        
                rowData={jobList} // Row Data for Rows
        
                columnDefs={columnDefs} // Column Defs for Columns
                defaultColDef={defaultColDef} // Default Column Properties
        
                animateRows={true} // Optional - set to 'true' to have rows animate when sorted
                rowSelection='multiple' // Options - allows click selection of rows
        
                onCellClicked={cellClickedListener} // Optional - registering for Grid Event

                onGridReady={onGridReady}
                />
            </div>
        </div>
      );

    // return (
    //     <>
    //     <div className='joblist-column-headers'>
    //         <div className='column numCol'>Number</div>
    //         <div className='column textCol'>Location</div>
    //         <div className='column numCol'># Holes</div>
    //         <div className='column numCol'>Total Ft</div>
    //         <div className='column numCol'>Rig</div>
    //     </div>
    //     <div className='database'>
    //         <div className='joblist-container'>
    //             {jobList.map((job) => {

    //                 return (
    //                     <div className='single-job' key={job.id}>
    //                         <div className='column numCol'>{job.jobNumber}</div>
    //                         <div className='column textCol'>{job.location}</div>
    //                         <div className='column numCol'>{job.numHoles}</div>
    //                         <div className='column numCol'>{job.numFeet}</div>
    //                         <div className='column numCol'>{job.rigId}</div>
    //                     </div>
    //                 )

    //             })}
    //         </div>
    //     </div>
    //     </>
    // )
}

export default Database;