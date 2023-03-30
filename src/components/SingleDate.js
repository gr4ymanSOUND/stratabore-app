import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';

import DateRig from './DateRig';

const SingleDate = ({currentMonth, specificDate, jobList, rigList}) => {
  
  // split the date string into parts to create the date labels
  const dateParts = specificDate.split("-");
  // check if the day starts with a leading zero, and remove it for a cleaner display at the top of the card
  if (dateParts[2][0] == '0') {
    dateParts[2] = dateParts[2].slice(1);
    console.log('removed a leading zero', dateParts[2])
  }
  // check if the date is in the current month or not, and adjust the label appropriately
  if (dateParts[1] != currentMonth + 1) {
    dateParts[2] = `(${dateParts[2]})`;
  }

  // helper function and filter to find the list of jobs for this particular date
  const findDayJobs = (job) => {
    if (job.jobDate === specificDate) {
      return true;
    }
    return false;
  }
  const dayJobs = jobList.filter(findDayJobs);

  return (
    <>
      <div>{dateParts[2]}</div>
      {
          rigList.map((rig,index) => {
            return (
              <div id={rig.licensePlate} key={index}>
                <DateRig
                  rig={rig}
                  dayJobs={dayJobs}
                />
              </div>
            )
          })
      }
    </>
  )

}

export default SingleDate;