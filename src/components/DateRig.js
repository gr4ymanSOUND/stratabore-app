import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';

import { deleteJobRig, getAssignedAndUnassignedJobs } from '../axios-services/index';

const DateRig = ({ token, specificDate, rig, dayJobs, setJobList, formType, setFormType, currentSelected, setCurrentSelected}) => {

  const [detailView, setDetailView] = useState(false);

  // this handles keeping the detail view open when the form opens for editing
  useEffect(()=>{
    if (currentSelected.rigId === rig.id && specificDate === currentSelected.jobDate && rigJobs.length > 0) {
      setDetailView(true);
    }
    if (currentSelected.status === 'unassigned' || rigJobs.length < 1) {
      setDetailView(false);
    }
    if (formType==='unassigned') {
      setDetailView(false);
      setCurrentSelected({});
    }

  },[formType])
  
  // handles detail view toggling, only if there are jobs for that rig
  const showDetail = (e) => {
    if (rigJobs.length > 0 ){
      setDetailView(!detailView);
    }
  };

  // filter the dayJobs for the current rig
  const findRigJobs = (job) => {
    if (job.rigId === rig.id) {
      return true;
    }
    return false;
  };
  const rigJobs = dayJobs.filter(findRigJobs);

  // logic to determine which coloring option to use for the rig, depending on the number of jobs and rig status
  const style = {backgroundColor: `${rig.boardColor}`, border: 'none'};
  if (rigJobs.length < 1) {
    style.backgroundColor = `darkgray`
  }
  if (rig.status == 'inactive') {
    style.border = '1px red solid';
    style.backgroundColor = `darkgray`
  }
  if (rig.status == 'repairs') {
    style.border = '1px green solid';
    style.backgroundColor = `darkgray`
  }

  // work out something to count up the total of the job lengths and dislpay the counter-bars correctly
  // also do something to color it differently if overbooked with a length of 3 or more
  // include logic that tells whether one of the jobs in an overbooked rig is lenght 2, with yet another color or potentially an icon inside the bars


  return (
    <>
      <div onClick={showDetail} className="day-rig" style={style}>
        {
          (rig.status !== 'active' || rigJobs.length < 1) ? (
            <div className='day-rig-id' style={{color: rig.boardColor}}>{rig.id}</div>
          ) : null
        }
        <div className='day-rig-count'>
          {/* {`${rigJobs.length}`} */}
          {
            rigJobs.map((job, index) => {
              if (job.jobLength > 1) {
                return (
                  <div key={job.id} className='counter-bar two-length'></div>
                )
              }
              return (
                <div key={job.id} className='counter-bar'></div>
              )
            })
          }
        </div>
        {
          detailView ? (
            <div onClick={showDetail} className="day-rig-detail" style={style}>
              <div className='rig-info' >
                <div>ID: {rig.id}</div>
                <div>{rig.licensePlate}</div>
                <div>{rig.rigType}</div>
                <div>{rig.status}</div>
              </div>
              {
              rigJobs.map((job, index) => {
                const editButton = (e) => {
                  e.preventDefault();
                  setFormType(e.target.id);
                  setCurrentSelected(job);
                }
                const unassignButton = async (e) => {
                  e.preventDefault();
                  const jobToUnassign = { jobId: job.id, rigId: job.rigId }
                  if (confirm(`Are you sure you want to unassign this job? \n Job:${jobToUnassign.jobId}, Rig:${jobToUnassign.rigId}`)) {
                    const unassignedJob = await deleteJobRig(token, jobToUnassign);
                    setFormType(e.target.id);
                    // reload the joblist to reflect the changes in the spreadsheet
                    const newJobList = await getAssignedAndUnassignedJobs(token)
                    setJobList(newJobList);
                  }
                }
                return (
                  <div key={job.jobNumber} className="rig-detail-job">
                    <div>
                      {job.jobNumber}
                      <button id='edit-job' className='calendar-form-button' onClick={editButton}>Edit</button>
                      <button id='unassigned' className='calendar-form-button' onClick={unassignButton}>Unassign</button>
                    </div>
                  </div>
                )
              })
              }
            </div>
          ) : null
        }
        <div className='rig-icons'>
          {
            (rig.registrationDueDate == specificDate) ? (
              <i className="fa fa-id-card-o" aria-hidden="true"></i>
            ) : null
          }
          {
            (rig.maintenanceDueDate == specificDate) ? (
              <i className="fa fa-wrench" aria-hidden="true"></i>
            ) : null
          }
        </div>
      </div>
    </>
  )

};

export default DateRig;