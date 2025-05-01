import React, { useState, useEffect } from 'react';

import DateRig from './DateRig';

const SingleDate = ({ currentMonth, specificDate, jobList, rigList, setDetailView, showDetail, setShowDetail}) => {


  const [dayJobs, setDayJobs] = useState([]);

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

  // filter the job list for jobs that are scheduled for the current date
  useEffect(()=>{
    const currentDayJobs = jobList.filter((job) => {
      if (job.jobDate === specificDate && job.status != 'canceled') {
        return true;
      }
      return false;
    });
    setDayJobs(currentDayJobs);
  },[]);
  if (dayJobs.length != 0) {console.log('day jobs', specificDate, dayJobs);}


  const showDetailButton = (e) => {
    e.preventDefault();

    const detailID = e.currentTarget.id;
    const detailRig = rigList.find((rig) => rig.id == detailID);
    console.log('detail id', detailID);
    console.log('detail rig', detailRig);

    setDetailView({date: specificDate, rig: detailRig, dayJobs: dayJobs});

    !showDetail ? setShowDetail(true): null;
  }


  return (
    <>
      <div className='day-label'>{dateParts[2]}</div>
      <div className='day-content'>
      {
        rigList.map((rig,index) => {
          return (
            <div onClick={showDetailButton} id={rig.id} key={rig.id}>
              <DateRig
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