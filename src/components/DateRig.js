import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';

import { deleteJobRig, getAssignedAndUnassignedJobs } from '../axios-services/index';

const DateRig = ({specificDate, rig, dayJobs}) => {

  // filter the dayJobs for the current rig
  // putting this in state doesn't appear to be necessary, and also ends up causing too many re-renders
  // Memoize the filtered jobs for the rig
  const rigJobs = useMemo(() => {
    return dayJobs.filter((job) => job.rigId === rig.id);
  }, [dayJobs, rig.id]);

  // logic to determine which coloring option to use for the rig, depending on the number of jobs and rig status
  // Memoize the style object
  const style = useMemo(() => {
    const baseStyle = { backgroundColor: `${rig.boardColor}`, border: 'none' };
    if (rigJobs.length < 1) {
      baseStyle.backgroundColor = `darkgray`;
    }
    if (rig.status === 'inactive') {
      baseStyle.border = '1px red solid';
      baseStyle.backgroundColor = `darkgray`;
    }
    if (rig.status === 'repairs') {
      baseStyle.border = '1px green solid';
      baseStyle.backgroundColor = `darkgray`;
    }
    return baseStyle;
  }, [rig, rigJobs]);

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