import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';

const DateRig = ({rig, dayJobs}) => {

  const [detailView, setDetailView] = useState(false);
  
  const showDetail = (e) => {
    setDetailView(!detailView);
  };

  // filter the dayJobs for the current rig
  const findRigJobs = (job) => {
    if (job.rigId === rig.id) {
      return true;
    }
    return false;
  };
  const rigJobs = dayJobs.filter(findRigJobs);

  if (rigJobs.length < 1) {
    return (
      <div onClick={showDetail} style={{color: 'darkgrey'}}>{`#${rig.id}[${rigJobs.length}]`}</div>
    );
  }

  return (
    <>
      <div onClick={showDetail} style={{color: rig.boardColor}}>{`#${rig.id}[${rigJobs.length}]`}</div>
      {
        detailView ? (
          rigJobs.map((job, index) => {
            return (
              <div key={job.jobNumber}>
                {job.jobNumber}
              </div>
            )
          })
        ) : null
      }
    </>
  )

};

export default DateRig;