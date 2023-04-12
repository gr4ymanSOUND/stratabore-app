import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';

import { getAllJobs, addJob, cancelJob, editJob } from '../axios-services';

const JobForm = ({ token, formType, setFormType, setJobList, currentSelected, setCurrentSelected }) => {
  // state for editable form fields
  const [jobNumber, setJobNumber] = useState('');
  const [client, setClient] = useState('');
  const [location, setLocation] = useState('');
  const [numHoles, setNumHoles] = useState('');
  const [numFeet, setNumFeet] = useState('');
  const [jobDate, setJobDate] = useState('');
  const [rigId, setRigId] = useState('');
  const [jobStatus, setJobStatus] = useState('');

  // when the current selection or formtype changes, adjust the state to reflect the change
  useEffect(() => {

    if (formType === "edit-job") {
      setJobNumber(currentSelected.jobNumber);
      setClient(currentSelected.client);
      setLocation(currentSelected.location);
      setNumHoles(currentSelected.numHoles);
      setNumFeet(currentSelected.numFeet);
      setJobDate(currentSelected.jobDate);
      setRigId(currentSelected.rigId);
      setJobStatus(currentSelected.status);
    }

    // makes sure the form is empty when it is hidden
    if (formType == "") {
      setJobNumber('')
      setClient('');
      setLocation('');
      setNumHoles('');
      setNumFeet('');
      setJobDate('')
      setRigId('');
      setJobStatus('');
    }

  }, [formType, currentSelected])

  // listens to any submit event - either add or edit
  const submitListener = async (e) => {
    e.preventDefault();

    const newJob = {
      jobNumber: jobNumber,
      client: client,
      location: location,
      numHoles: numHoles,
      numFeet: numFeet,
      jobDate: jobDate,
      rigId: rigId,
      status: jobStatus
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
    setClient('');
    setLocation('');
    setNumHoles('');
    setNumFeet('');
    setJobDate('');
    setRigId('');
    setJobStatus('');
    setFormType("reset")

    // sets the edited job data into react state as the currently selected row - used on the database page to re-select the row after editing has finished
    setCurrentSelected(newJob);

    // reset the job list and see the newly added/edited data in the spreadsheet
    const newJobList = await getAllJobs(token);
    setJobList(newJobList);

  };

  // specifically listens to the cancel button
  const cancelListener = async (e) => {
    e.preventDefault();

    // sanity check with the user before deleting
    if( confirm(`Are you sure you want to cancel this job? \n Job #: ${currentSelected.jobNumber}`) ) {
      // call the API to cancel the job
      const jobId = currentSelected.id;
      await cancelJob(token, jobId);

      // reset the selection and hide the form
      setCurrentSelected({});
      setFormType("reset")

      // reset the job list to include the changes
      const newJobList = await getAllJobs(token);
      setJobList(newJobList);
    }
  };

  return !formType ? null : (
    <>
      <form className='form-container' onSubmit={submitListener}>
        <div className='job-form'>
          <div className="input-section">
            <label className="input-label">Job #:</label>
            <input
              type="text"
              value={jobNumber}
              onChange={({ target: { value } }) => setJobNumber(value)}
              className="form-control"
              id="jobNumber"
              placeholder="XXX-000"
            />
          </div>
          <div className="input-section">
            <label className="input-label">Client:</label>
            <select 
              id="client"
              name="client"
              value={client}
              onChange={({ target: { value } }) => setClient(value)}
            >
              <option value="EWL">EWL</option>
              <option value="TER">TER</option>
              <option value="AAA">AAA</option>
              <option value="ZZZ">ZZZ</option>
            </select>
          </div>
          <div className="input-section">
            <label className="input-label">Location:</label>
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
            <label className="input-label"># Holes:</label>
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
            <label className="input-label"># Ft:</label>
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
            <label className="input-label">Date:</label>
            <input
              type="date"
              value={jobDate}
              onChange={({ target: { value } }) => setJobDate(value)}
              className="form-control"
              id="jobDate"
              placeholder=""
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
          <div className="input-section">
            <label className="input-label">Status:</label>
            <select 
              id="jobStatus"
              name="jobStatus"
              value={jobStatus}
              onChange={({ target: { value } }) => setJobStatus(value)}
            >
              <option value="pending">Pending</option>
              <option value="complete">Complete</option>
              <option value="canceled">Canceled</option>
            </select>
          </div>
          <button className="submit-button" type='submit'>Save and Submit</button>
          {(formType === "edit-job") ? <button id='cancel-job' onClick={cancelListener}>Cancel Job</button> : null}
        </div>
      </form>
    </>
  )
}

export default JobForm;