import React, { useState, useEffect, useMemo, useCallback } from 'react';

import DateRig from './DateRig';

const SingleDate = ({ currentMonth, specificDate, jobList, rigList, setDetailView, showDetail, setShowDetail}) => {


  // Memoize the filtered jobs for the specific date
  const dayJobs = useMemo(() => {
    return jobList.filter(
      (job) => job.jobDate === specificDate && job.status !== 'canceled'
    );
  }, [jobList, specificDate]);

  // Process the date parts for display
  const dateParts = useMemo(() => {
    const parts = specificDate.split('-');
    if (parts[2][0] === '0') {
      parts[2] = parts[2].slice(1);
    }
    if (parts[1] != currentMonth + 1) {
      parts[2] = `(${parts[2]})`;
    }
    return parts;
  }, [specificDate, currentMonth]);

  const showDetailButton = useCallback(
    (e) => {
      e.preventDefault();
      const detailID = e.currentTarget.id;
      const detailRig = rigList.find((rig) => rig.id == detailID);
      setDetailView({ date: specificDate, rig: detailRig, dayJobs });
      if (!showDetail) setShowDetail(true);
    },
    [rigList, specificDate, dayJobs, setDetailView, showDetail, setShowDetail]
  );


  return (
    <>
      <div className='day-label'>{dateParts[2]}</div>
      <div className='day-content'>
      {
        rigList.map((rig,index) => {
          return (
            <div onClick={showDetailButton} id={rig.id} key={rig.id}>
              <DateRig
                key={rig.id}
                specificDate={specificDate}
                rig={rig}
                dayJobs={dayJobs}
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