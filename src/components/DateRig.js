import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';

const DateRig = ({rig, dayJobs}) => {
  
  // filter the dayJobs for the current rig
  const findRigJobs = (job) => {
    if (job.rigId === rig.id) {
      return true;
    }
    return false;
  };
  const rigJobs = dayJobs.filter(findRigJobs);


  return (
    <div>{`${rig.boardColor}(${rigJobs.length})`}</div>
  )

};

export default DateRig;