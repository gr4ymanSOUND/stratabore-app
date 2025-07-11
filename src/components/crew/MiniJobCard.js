import React, { useMemo } from 'react';

const MiniJobCard = ({ jobList, assignedRig, specificDate }) => {

  const style = useMemo(() => {
    // Default: neutral background, colored border
    const baseStyle = {
      backgroundColor: `#fff`,
      border: `2px solid ${assignedRig.boardColor || '#888'}`,
      color: 'black',
      textShadow: 'none'
    };
    if (jobList.length < 1) {
      baseStyle.backgroundColor = `#eee`;
      baseStyle.color = 'black';
    }
    if (assignedRig.status === 'inactive') {
      baseStyle.border = '2px solid red';
      baseStyle.backgroundColor = `#eee`;
      baseStyle.color = 'black';
    }
    if (assignedRig.status === 'repairs') {
      baseStyle.border = '2px solid green';
      baseStyle.backgroundColor = `#eee`;
      baseStyle.color = 'black';
    }
    return baseStyle;
  }, [assignedRig, jobList]);

  // Only week view logic
  const viewContent = jobList.map((job) => (
    <div key={job.id} className='mini-job'>
      <h3>{job.jobNumber}</h3>
      <div className='mini-job-description'>
        
        <p>{job.location}</p>
        <p>{job.numHoles} holes, {job.numFeet} feet</p>
      </div>
    </div>
  ));

  return (
    <div className='mini-job-card' id={assignedRig.id} key={assignedRig.id} style={style}>
      {(assignedRig.status !== 'active' || jobList.length < 1) ? (
        <div className='day-rig-id' style={{color: assignedRig.boardColor}}>{assignedRig.id}</div>
      ) : null}
      <div className='mini-job-list'>
        {viewContent}
      </div>
      <div className='rig-icons'>
        {assignedRig.registrationDueDate === specificDate ? (
          <i className="fa fa-id-card-o" aria-hidden="true" id="rig-icon"></i>
        ) : null}
        {assignedRig.maintenanceDueDate === specificDate ? (
          <i className="fa fa-wrench" aria-hidden="true"></i>
        ) : null}
      </div>
    </div>
  );
};

export default MiniJobCard;