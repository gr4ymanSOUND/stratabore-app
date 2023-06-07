import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';

import DateRig from './DateRig';

const SingleDate = ({token, currentMonth, specificDate, jobList, setJobList, rigList, formType, setFormType, currentSelected, setCurrentSelected, detailView, setDetailView}) => {

  // split the date string into parts to create the date labels
  // check if the day starts with a leading zero, and remove it for a cleaner display at the top of the card
  // check if the date is in the current month or not, and adjust the label appropriately
  const dateParts = specificDate.split("-");
  if (dateParts[2][0] == '0') {
    dateParts[2] = dateParts[2].slice(1);
  }
  if (dateParts[1] != currentMonth + 1) {
    dateParts[2] = `(${dateParts[2]})`;
  }

  const dayJobs = jobList.filter((job) => {
    if (job.jobDate === specificDate && (job.status === 'pending' || job.status === 'completed')) {
      return true;
    }
    return false;
  });

  return (
    <>
      <div className='day-label'>{dateParts[2]}</div>
      <div className='day-content'>
        {
            rigList.map((rig,index) => {
              return (
                <div id={rig.licensePlate} key={rig.licensePlate}>
                  <DateRig
                    token={token}
                    specificDate={specificDate}
                    rig={rig}
                    dayJobs={dayJobs}
                    setJobList={setJobList}
                    formType={formType}
                    setFormType={setFormType}
                    currentSelected={currentSelected}
                    setCurrentSelected={setCurrentSelected}
                    detailView={detailView}
                    setDetailView={setDetailView}
                  />
                </div>
              )
            })
        }
      </div>
    </>
  )

}

export default SingleDate;