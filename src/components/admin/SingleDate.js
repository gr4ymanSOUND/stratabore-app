import React, { useState, useEffect, useMemo, useCallback } from 'react';

import DateRig from './DateRig';

const SingleDate = ({ currentMonth, specificDate, jobList, rigList, setDetailView, showDetail, setShowDetail, viewType}) => {

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

  let viewContent;
  if (viewType === 'month') {
    viewContent = (
      <div className='full-month'>
        {
          rigList.map((rig,index) => {
            return (
              <div onClick={showDetailButton} id={rig.id} key={rig.id}>
                <DateRig
                  key={rig.id}
                  specificDate={specificDate}
                  rig={rig}
                  dayJobs={dayJobs}
                  viewType={viewType}
                />
              </div>
            )
          })
        }
      </div>)
  } else if (viewType === 'week') {
     viewContent = (
      <div className='one-week'>
        {
          rigList.map((rig,index) => {
            return (
              <div onClick={showDetailButton} id={rig.id} key={rig.id}>
                <DateRig
                  key={rig.id}
                  specificDate={specificDate}
                  rig={rig}
                  dayJobs={dayJobs}
                  viewType={viewType}
                />
              </div>
            )
          })
        }
      </div>
     )     
  } else if (viewType === 'day') {
    viewContent = (
      <div className='one-day'>
        {
          rigList.map((rig,index) => {
            return (
                <div onClick={showDetailButton} id={rig.id} key={rig.id}>
                  <DateRig
                    key={rig.id}
                    specificDate={specificDate}
                    rig={rig}
                    dayJobs={dayJobs}
                    viewType={viewType}
                  />
                </div>
            )
          })
        }
      </div>
    )
  }

  //helper function for formatting the date for a single day view
  const formatSpecificDate = (dateString) => {
    // Create a Date object directly from the specificDate string
    const date = new Date(`${dateString}T00:00:00`); // Ensure it's treated as a local date
  
    // Format the date into the desired string
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'long', // Full name of the day (e.g., Monday)
      month: 'long',   // Full name of the month (e.g., May)
      day: 'numeric',  // Day of the month (e.g., 12)
      year: 'numeric', // Full year (e.g., 2025)
    }).format(date);
  };

  let headerStyle = 'day-of-week';
  if (viewType === 'day') {
    headerStyle = 'day-of-week' + ' day-single';
  }
  

  return (
    <>
      {
        viewType === 'day' ? (
        <div className={headerStyle}>
          <div className='dayName'>{formatSpecificDate(specificDate)}</div>
        </div>
        ) : (
          <div className='day-label'>{dateParts[2]}</div>
        )
      }
      {viewContent}
    </>
  )

}

export default SingleDate;