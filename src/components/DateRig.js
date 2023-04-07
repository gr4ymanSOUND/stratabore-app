import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';

const DateRig = ({rig, dayJobs}) => {

  const [detailView, setDetailView] = useState(false);
  
  // filter the dayJobs for the current rig
  const findRigJobs = (job) => {
    if (job.rigId === rig.id) {
      return true;
    }
    return false;
  };
  const rigJobs = dayJobs.filter(findRigJobs);

  const showDetail = (e) => {
    setDetailView(!detailView);
  };


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