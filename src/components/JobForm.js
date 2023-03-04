import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';

import { getAllJobs, addJob, deleteJob, editJob } from '../axios-services';

const JobForm = ({ token, formType, setFormType, setJobList, currentSelected, setCurrentSelected }) => {

  const gridRef = useRef();
  const [jobNumber, setJobNumber] = useState('');
  const [location, setLocation] = useState('');
  const [numHoles, setNumHoles] = useState('');
  const [numFeet, setNumFeet] = useState('');
  const [rigId, setRigId] = useState('');


  useEffect(() => {
    if (formType === "edit-job") {
      setJobNumber(currentSelected.jobNumber);
      setLocation(currentSelected.location);
      setNumHoles(currentSelected.numHoles);
      setNumFeet(currentSelected.numFeet);
      setRigId(currentSelected.rigId);
    }

    if (formType == "") {
      setJobNumber("");
      setLocation("");
      setNumHoles("");
      setNumFeet("");
      setRigId("");
    }

  }, [formType, currentSelected])


  const submitListener = async (e) => {
    e.preventDefault();

    const newJob = {
      jobNumber: jobNumber,
      location: location,
      numHoles: numHoles,
      numFeet: numFeet,
      rigId: rigId
    }

    if (formType == 'add-job') {
      const response = await addJob(token, newJob);
    }
    if (formType == 'edit-job') {
      const jobId = currentSelected.id;
      const response = await editJob(token, jobId, newJob)
      console.log('edit job submission, id: ', jobId, newJob);
    }
    
    //reset form state and close the form after sumbission
    setJobNumber('');
    setLocation('');
    setNumHoles('');
    setNumFeet('');
    setRigId('');
    setFormType("reset")

    // reset the job list and see the newly added/edited data in the spreadsheet
    const newJobList = await getAllJobs(token);
    setJobList(newJobList);
  };

  const deleteListener = async (e) => {
    e.preventDefault();
    const jobId = currentSelected.id;
    await deleteJob(token, jobId);

    // reset the selection and hide the form
    setCurrentSelected({});
    setFormType("reset")

    // reset the job list
    const newJobList = await getAllJobs(token);
    setJobList(newJobList);
  };

  // const cancelListener = useCallback(e => {
  //   e.preventDefault();
  //   setFormType("reset");
  // }, []);


  return !formType ? null : (
    <>
      <form className='job-form' onSubmit={submitListener}>
        <div className='job-body'>
          <div className="input-section">
            <label className="input-label">Job Number</label>
            <input
              type="text"
              value={jobNumber}
              onChange={({ target: { value } }) => setJobNumber(value)}
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
              onChange={({ target: { value } }) => setLocation(value)}
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
              onChange={({ target: { value } }) => setNumHoles(value)}
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
              onChange={({ target: { value } }) => setNumFeet(value)}
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
              onChange={({ target: { value } }) => setRigId(value)}
              className="form-control"
              id="rigId"
              placeholder="?"
            />
          </div>
          <button className="submit-button" type='submit'>Save and Submit</button>
          {(formType === "edit-job") ? <button id='delete-job' onClick={deleteListener}>Delete Job</button> : null}
          {/* <button className="cancel-button" onClick={cancelListener}>Cancel</button> */}
        </div>
      </form>
    </>
  )

}

export default JobForm;