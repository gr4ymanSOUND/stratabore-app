import React, { useState, useEffect, useMemo } from 'react';

const MiniJobCard = ({ jobList, assignedRig, viewType, specificDate }) => {


const style = useMemo(() => {
    const baseStyle = { backgroundColor: `${assignedRig.boardColor}`, border: 'none', color: 'white', textShadow: '1px 1px 2px black' };
    if (jobList.length < 1) {
      baseStyle.backgroundColor = `darkgray`;
      baseStyle.color = 'black'
      baseStyle.textShadow = 'none'
    }
    if (assignedRig.status === 'inactive') {
      baseStyle.border = '1px red solid';
      baseStyle.backgroundColor = `darkgray`;
      baseStyle.color = 'black'
      baseStyle.textShadow = 'none'
    }
    if (assignedRig.status === 'repairs') {
      baseStyle.border = '1px green solid';
      baseStyle.backgroundColor = `darkgray`;
      baseStyle.color = 'black'
      baseStyle.textShadow = 'none'
    }
    return baseStyle;
  }, [assignedRig]);



let viewContent;

viewType == "month" ? (
    viewContent = jobList.map((job, index) => {
      return (
        <div key={job.id} className='mini-job'>
          {job.jobNumber}
          {    
            jobList.jobLength > 0.4 && jobList.jobLength < 1 ? (
              <div className='day-rig-count'>
                <div className='counter-bar two-length'></div>
              </div>
            ) : jobList.jobLength >= 1.0 ? (
              <div className='day-rig-count'>
                <div className='counter-bar full-length'></div>
              </div>
            ) : (
              <div className='day-rig-count'>
                <div className='counter-bar'></div>
              </div>
            )
          }
        </div>
      );
    })
) : (
    viewContent = jobList.map((job, index) => {
      return (
        <div key={job.id} className='mini-job'>
          <div className='mini-job-description'>
            <h3>{job.jobNumber}</h3>
            <p>{job.location}</p>
            <p>{job.numHoles} holes, {job.numFeet} feet</p>
          </div>
          {    
            jobList.jobLength > 0.4 && jobList.jobLength < 1 ? (
              <div className='day-rig-count'>
                <div className='counter-bar two-length'></div>
              </div>
            ) : jobList.jobLength >= 1.0 ? (
              <div className='day-rig-count'>
                <div className='counter-bar full-length'></div>
              </div>
            ) : (
              <div className='day-rig-count'>
                <div className='counter-bar'></div>
              </div>
            )
          }
        </div>
      );
    })
);

return (
    <div className='mini-job-card' id={assignedRig.id} key={assignedRig.id} style={style}>
      {
        (assignedRig.status !== 'active' || jobList.length < 1) ? (
          <div className='day-rig-id' style={{color: assignedRig.boardColor}}>{assignedRig.id}</div>
        ) : null
      }
      <div className='mini-job-list'>
        {viewContent}
      </div>
      <div className='rig-icons'>
        {
          (assignedRig.registrationDueDate == specificDate) ? (
            <i className="fa fa-id-card-o" aria-hidden="true" id="rig-icon"></i>
          ) : null
        }
        {
          (assignedRig.maintenanceDueDate == specificDate) ? (
            <i className="fa fa-wrench" aria-hidden="true"></i>
          ) : null
        }
      </div>
    </div>
  )


}

export default MiniJobCard;