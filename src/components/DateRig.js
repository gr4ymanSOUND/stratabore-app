import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';

import { deleteJobRig, getAssignedAndUnassignedJobs } from '../axios-services/index';

const DateRig = ({specificDate, rig, dayJobs}) => {

  // filter the dayJobs for the current rig
  // putting this in state doesn't appear to be necessary, and also ends up causing too many re-renders
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

  return (
    <>
      <div className="day-rig" id={rig.id} key={rig.id} style={style}>
        {
          (rig.status !== 'active' || rigJobs.length < 1) ? (
            <div className='day-rig-id' style={{color: rig.boardColor}}>{rig.id}</div>
          ) : null
        }
        <div className='day-rig-count'>
          {
            rigJobs.map((job, index) => {
              if (job.jobLength > 0.4 && job.jobLength < 1) {
                return (
                  <div key={job.id} className='counter-bar two-length'></div>
                )
              }
              if (job.jobLength >= 1.0) {
                return (
                  <div key={job.id} className='counter-bar full-length'></div>
                )
              }
              return (
                <div key={job.id} className='counter-bar'></div>
              )
            })
          }
        </div>
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