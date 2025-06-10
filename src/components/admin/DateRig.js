import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';

import { deleteJobRig, getAssignedAndUnassignedJobs } from '../../axios-services/index';

const DateRig = ({specificDate, rig, dayJobs, viewType}) => {

  // filter the dayJobs for the current rig
  // putting this in state doesn't appear to be necessary, and also ends up causing too many re-renders
  // Memoize the filtered jobs for the rig, helping to avoid those unnecessary re-renders
  const rigJobs = useMemo(() => {
    return dayJobs.filter((job) => job.rigId === rig.id);
  }, [dayJobs, rig.id]);

  // logic to determine which coloring option to use for the rig, depending on the number of jobs and rig status
  // Memoize the style object, helping to avoid unnecessary re-renders
  const style = useMemo(() => {
    const baseStyle = { backgroundColor: `${rig.boardColor}`, border: 'none', color: 'white', textShadow: '1px 1px 2px black' };
    if (rigJobs.length < 1) {
      baseStyle.backgroundColor = `darkgray`;
      baseStyle.color = 'black'
      baseStyle.textShadow = 'none'
    }
    if (rig.status === 'inactive') {
      baseStyle.border = '1px red solid';
      baseStyle.backgroundColor = `darkgray`;
      baseStyle.color = 'black'
      baseStyle.textShadow = 'none'
    }
    if (rig.status === 'repairs') {
      baseStyle.border = '1px green solid';
      baseStyle.backgroundColor = `darkgray`;
      baseStyle.color = 'black'
      baseStyle.textShadow = 'none'
    }
    return baseStyle;
  }, [rig, rigJobs]);

  // set up some specific display templates for each viewType
  let viewContent;
  if (viewType === 'day') {
    viewContent = (
      <div className='day-rig-summary'>
        <div>
          Jobs: {rigJobs.length}
        </div>
        <div>
          Holes: {rigJobs.reduce((total, job) => total + job.numHoles, 0)}
        </div>
        <div>
          Ft: {rigJobs.reduce((total, job) => total + job.numFeet, 0)}
        </div>
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
      </div>
    );
  }
  else if (viewType === 'week') { 
    viewContent = (
      <div className='week-rig-summary'>
        <div>
          Jobs: {rigJobs.length}
        </div>
        <div>
          Holes: {rigJobs.reduce((total, job) => total + job.numHoles, 0)}
        </div>
        <div>
          Ft: {rigJobs.reduce((total, job) => total + job.numFeet, 0)}
        </div>
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
      </div>
    );
  }
  else if (viewType === 'month') { 
    viewContent = (
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
    );
  } 

  return (
      <div className="day-rig" id={rig.id} key={rig.id} style={style}>
        {
          (rig.status !== 'active' || rigJobs.length < 1) ? (
            <div className='day-rig-id' style={{color: rig.boardColor}}>{rig.id}</div>
          ) : null
        }
        {viewContent}
        <div className='rig-icons'>
          {
            (rig.registrationDueDate == specificDate) ? (
              <i className="fa fa-id-card-o" aria-hidden="true" id="rig-icon"></i>
            ) : null
          }
          {
            (rig.maintenanceDueDate == specificDate) ? (
              <i className="fa fa-wrench" aria-hidden="true"></i>
            ) : null
          }
        </div>
      </div>
  )

};

export default DateRig;