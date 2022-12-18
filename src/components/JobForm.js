import React, { useState, useRef, useEffect, useMemo, useCallback} from 'react';

import { getAllJobs, addJob } from '../axios-services';

const JobForm = ({token, formType, setFormType, setJobList}) => {

    const [ jobNumber, setJobNumber ]  = useState('');
    const [ location, setLocation ] = useState('');
    const [ numHoles, setNumHoles ] = useState('');
    const [ numFeet, setNumFeet ] = useState('');
    const [ rigId, setRigId ] = useState('');


    const submitListener = async (e) => {
        e.preventDefault();

        const newJob = {
            jobNumber: jobNumber,
            location: location,
            numHoles: numHoles,
            numFeet: numFeet,
            rigId: rigId
        }

        // add new job and then re-load and reset the entire job list
        const response = await addJob(token, newJob);
        const newJobList = await getAllJobs(token);
        setJobList(newJobList);
        setFormType("")

        //reset form state after sumbission
        setJobNumber('');
        setLocation('');
        setNumHoles('');
        setNumFeet('');
        setRigId('');
        
    };

    const cancelListener = useCallback( e => {
        e.preventDefault();
        // re-set the form type to hide the form
        setFormType("");
    },[]);


    return !formType ? null : (
        <>
            <form className='addJob' onSubmit={submitListener}>
                <div className='job-body'>
                    <div className="input-section">
                        <label className="input-label">Job Number</label>
                        <input
                            type="text"
                            value={jobNumber}
                            onChange={({target: {value}}) => setJobNumber(value)}
                            className="form-control"
                            id="jobNum"
                            placeholder="XXX-000"
                        />
                    </div>
                    <div className="input-section">
                        <label className="input-label">Location</label>
                        <input
                            type="text"
                            value={location}
                            onChange={({target: {value}}) => setLocation(value)}
                            className="form-control"
                            id="location"
                            placeholder="City, ST"
                        />
                    </div>
                    <div className="input-section">
                        <label className="input-label"># Holes</label>
                        <input
                            type="number"
                            value={numHoles}
                            onChange={({target: {value}}) => setNumHoles(value)}
                            className="form-control"
                            id="numHoles"
                            placeholder="1"
                        />
                    </div>
                    <div className="input-section">
                        <label className="input-label"># Feet</label>
                        <input
                            type="number"
                            value={numFeet}
                            onChange={({target: {value}}) => setNumFeet(value)}
                            className="form-control"
                            id="numFeet"
                            placeholder="20"
                        />
                    </div>
                    <div className="input-section">
                        <label className="input-label">Rig ID:</label>
                        <input
                            type="number"
                            value={rigId}
                            onChange={({target: {value}}) => setRigId(value)}
                            className="form-control"
                            id="rigId"
                            placeholder="?"
                        />
                    </div>
                    <button className="submit-button" type='submit'>Save and Submit</button>
                    <button className="cancel-button" onClick={cancelListener}>Cancel</button>
                </div>
            </form>
        </>
    )

}

export default JobForm;