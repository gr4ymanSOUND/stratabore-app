import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';

import { getAllJobs, addJob, cancelJob, editJob, createJobRig, getAssignedAndUnassignedJobs, updateJobRig, deleteJobRig } from '../../axios-services';

import { statusFilter, clientFilter, rigFilter } from './mapFilterHelpers';


const JobForm = ({ token, formType, setFormType, setJobList, currentSelected, setCurrentSelected, locationList, setLocationList, filterState, rigList }) => {
  // state for editable form fields
  const [jobNumber, setJobNumber] = useState('');
  const [client, setClient] = useState('EWL');
  const [location, setLocation] = useState('');
  const [numHoles, setNumHoles] = useState('');
  const [numFeet, setNumFeet] = useState('');
  const [jobDate, setJobDate] = useState('');
  const [jobLength, setJobLength] = useState(1);
  const [jobNotes, setJobNotes] = useState('');
  const [rigId, setRigId] = useState('');
  const [jobStatus, setJobStatus] = useState('pending');
  const [createdDate, setCreatedDate] = useState('');

  // when the current selection or formtype changes, adjust the state to reflect the change
  useEffect(() => {

    if (formType === "edit-job") {
      setJobNumber(currentSelected.jobNumber);
      setClient(currentSelected.client);
      setLocation(currentSelected.location);
      setNumHoles(currentSelected.numHoles);
      setNumFeet(currentSelected.numFeet);
      currentSelected.jobDate ? setJobDate(currentSelected.jobDate) : setJobDate('');
      setJobLength(currentSelected.jobLength);
      currentSelected.rigId ? setRigId(currentSelected.rigId) : setRigId('')
      setJobStatus(currentSelected.status);
      setJobNotes(currentSelected.notes);
    }

    // makes sure the form is empty when it is hidden
    if (formType == "") {
      setJobNumber('')
      setClient('EWL');
      setLocation('');
      setNumHoles('');
      setNumFeet('');
      setJobDate('')
      setRigId('');
      setJobStatus('pending');
      setJobNotes('');
    }

  }, [formType, currentSelected])

  // listens to any submit event - either add or edit
  const submitListener = async (e) => {
    e.preventDefault();

    if (!jobNumber || !location || !numHoles || !numFeet) {
      alert('Please fill in all required fields before submitting.');
      return;
    }

    if (jobDate || rigId) {
      if (!jobDate || !rigId) {
        alert('If assigning a Date or Rig, please fill in both. If you are trying to unassign or cancel the job, please use the other buttons.')
        return
      }

    }

    const newJob = {
      jobNumber: jobNumber,
      client: client,
      location: location,
      numHoles: numHoles,
      numFeet: numFeet,
      jobLength: jobLength,
      status: jobStatus,
      notes: jobNotes,
    }

    // if adding a job, get the current date and set it in the createdDate state
    if (formType == 'add-job') {
      const todayDate = new Date();
      let monthPart = todayDate.getUTCMonth() + 1;
      if (monthPart < 10) {
        monthPart = "0" + monthPart;
      }
      let dayPart = todayDate.getUTCDate();
      if (dayPart < 10) {
        dayPart = "0" + dayPart;
      }
      newJob.createdDate = `${todayDate.getUTCFullYear()}-${monthPart}-${dayPart}`;
      const response = await addJob(token, newJob);
    }
    if (formType == 'edit-job') {
      const jobId = currentSelected.id;
      const response = await editJob(token, jobId, newJob);
    }

    // if there is a jobDate or rigId stored in the rig form, we need to do checks and create or edit the assignment
    if (jobDate || rigId) {
      // if the job was unassigned, create a new job_rig record
      if (!currentSelected.jobDate && !currentSelected.rigId) {
        const newJobRig = { jobId: currentSelected.id, rigId: rigId, jobDate: jobDate };
        const assignedJob = await createJobRig(token, newJobRig);
      }

      // if there is a rig on the currentselected already, then it already has an assignment. that means we need to compare the dates and rigs to see if they were updated
      if (currentSelected.rigId) {
        // is the rig different?
        if (rigId != currentSelected.rigId) {
          if (confirm (`You are trying to change the assigned rig on this job. This will create a new job assignment with the date and rig supplied in the form. Continue?`)) {
            const newJobRig = { jobId: currentSelected.id, rigId: rigId, jobDate: jobDate }
            const assignedJob = await createJobRig(token, newJobRig);
          }
        } else  if (currentSelected.jobDate != jobDate) {
          // rig isn't different, so update the assignment with a new date or create a new assignment for the same job and rig on a new date
          if (confirm (`You are trying to change the date on this job assignment. If you want to assign this job to a second day, click OK.`)) {
            const newJobRig = { jobId: currentSelected.id, rigId: rigId, jobDate: jobDate }
            const assignedJob = await createJobRig(token, newJobRig);
          } else if (confirm (`If you want to move this job to a new date, click OK. Click Cancel to cancel editing the job`)) {
            // patching didn't work with the db because all 3 fields are combined to make the unique primary key
            // need to delete first, then create the new one
            const jobToUnassign = { jobId: currentSelected.id, rigId: currentSelected.rigId, jobDate: currentSelected.jobDate };
            const deletedJob = await deleteJobRig(token, jobToUnassign);
            const newJobRig = { jobId: currentSelected.id, rigId: rigId, jobDate: jobDate };
            const assignedJob = await createJobRig(token, newJobRig);
          }
        }
      }
    }
    
    //reset form state and close the form after sumbission
    setJobNumber('');
    setClient('');
    setLocation('');
    setNumHoles('');
    setNumFeet('');
    setJobDate('');
    setJobLength(1);
    setRigId('');
    setJobStatus('');
    setCreatedDate('');
    setJobNotes('');
    setFormType("")

    // sets the edited job data into react state as the currently selected row - used on the database page to re-select the row after editing has finished
    newJob.id = currentSelected.id;
    setCurrentSelected(newJob);

    // pull the new jobList to use in the if/else below
    const newJobList = await getAssignedAndUnassignedJobs(token)

    // if there is a locationList being passed in, we are in the map view and need to do things a bit differently by setting the locationList as well
    if (locationList) {
      const filteredJobs = newJobList.filter((job) => {
        return statusFilter(job, filterState) && clientFilter(job, filterState) && rigFilter(job, filterState, rigList);
      })
      setJobList(filteredJobs);
      const filteredLocations = filteredJobs.map((job)=>{
        return job.location;
      });
      setLocationList(filteredLocations);
    } else {
      // the main condition will be this one in the else statement - this takes care of setting the joblist for both the calendar and database view
      setJobList(newJobList);
    }

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
      setFormType("")

      // reset the job list to include the changes
      const newJobList = await getAssignedAndUnassignedJobs(token);
      setJobList(newJobList);
    }
  };

  // listens to the unassign button
  const unassignButton = async (e) => {
    e.preventDefault();

    const jobToUnassign = { jobId: currentSelected.jobId, rigId: rigId , jobDate: currentSelected.jobDate}

    if (confirm(`Are you sure you want to unassign this job? \n Job:${jobToUnassign.jobId}, Rig:${jobToUnassign.rigId}, Date: ${jobToUnassign.jobDate}`)) {
      const unassignedJob = await deleteJobRig(token, jobToUnassign);
      setFormType('');
      alert(unassignedJob)
      // reload the joblist to reflect the changes in the spreadsheet
      const newJobList = await getAssignedAndUnassignedJobs(token)
      setJobList(newJobList);
    }
  }

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
            <label className="input-label">Length:</label>
            <input
              type="number"
              value={jobLength}
              onChange={({ target: { value } }) => setJobLength(value)}
              className="form-control"
              id="length"
              min='0.1'
              max='1'
              step='0.1'
            />
          </div>
          <div className="input-section">
            <label className="input-label">Notes:</label>
            <textarea
              value={jobNotes}
              onChange={({ target: { value } }) => setJobNotes(value)}
              className="form-control notes-textarea"
              id="notes"
              placeholder="tall grass, sandy soil, etc."
            />
          </div>
          {
            // for now, we're not allowing you to set a rig and date when creating a new job
            formType === 'edit-job' ? (
            <>
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
                  min='0'
                  max='6'
                />
              </div>
            </>
            ) : null
          }
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
          <button className="submit-button" type='submit'>Save</button>
          {
          formType === "edit-job" ? <button id='cancel-job' onClick={cancelListener}>Cancel</button> : null
          }
          {
          currentSelected.rigId ? <button id='unnassign-job' onClick={unassignButton}>Unassign Job</button> : null
          }
        </div>
      </form>
    </>
  )
}

export default JobForm;