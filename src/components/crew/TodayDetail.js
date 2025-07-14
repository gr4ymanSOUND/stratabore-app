import React, { useState, useEffect } from 'react';

import { getAssignedJobs } from '../../axios-services';
import '../../mapquest/mapquest.js';


const TodayDetail = ({token, user, setLoading}) => {

  // creating a date object to set the current date on startup, adjusted to central time
  const getCentralTime = () => {
    const now = new Date();
    // Central Time is UTC-6 or UTC-5 depending on Daylight Saving Time
    const centralOffset = -6; // Base offset for Central Standard Time (CST)
    const isDST = now.getTimezoneOffset() < 300; // Check if Daylight Saving Time is active
    const centralTime = new Date(now.getTime() + (centralOffset + (isDST ? 1 : 0)) * 60 * 60 * 1000);

    // Format the date as yyyy-mm-dd
    const year = centralTime.getUTCFullYear();
    const month = (centralTime.getUTCMonth() + 1).toString().padStart(2, '0'); // Convert to 1-based month and pad with leading zero
    const day = centralTime.getUTCDate().toString().padStart(2, '0'); // Pad with leading zero

    return `${year}-${month}-${day}`;
  };
  const centralTime = getCentralTime();

  const [todayJobs, setTodayJobs] = useState([]);
  const [selectedDate, setSelectedDate] = useState(centralTime);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [jobs] = await Promise.all([
          getAssignedJobs(token),
        ]);
      // temporarily setting the todayJobs to the the jobs on 2/27/2025 for rig 1. this date and rig has 2 jobs, so it will give a good example of what the page will look like.
      const rigJobs = jobs.filter(job => job.jobDate === selectedDate && job.rigId === user.rigId);
      setTodayJobs(rigJobs);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user, selectedDate]);

  return (
    <div className='crew-page'>
      <div className='today-options'>
          <input
            className='month-date-input'
            type='date' 
            id='current-date-view'
            placeholder=''
            value={selectedDate}
            onChange={({ target: { value } }) => setSelectedDate(value)}
          >
          </input>
          <button
            className="custom-calendar-button"
            onClick={() => document.getElementById('current-date-view').showPicker()}
          >
            <i className="fa-regular fa-calendar"></i>
          </button>
      </div>
      <div className="today-details">



        <div className='today-jobs'>
          <h2>Rig: 1 <span>Date: {selectedDate}</span></h2>

          {todayJobs.length > 0 ? (
            todayJobs.map((job) => (
              <div key={job.id} className='job-card'>
                
                <article className='job-details'>
                  <h3>{job.jobNumber}</h3>
                  <div className='detail'>
                    <div className='detail-label'>Length: </div>
                    <div className='detail-data'>{job.jobLength}</div>
                  </div>
                  <div className='detail'>
                    <div className='detail-label'># Holes: </div>
                    <div className='detail-data'>{job.numHoles}</div>
                  </div>
                  <div className='detail'>
                    <div className='detail-label'># Feet: </div>
                    <div className='detail-data'>{job.numFeet}</div>
                  </div>
                  <div className='detail'>
                    <div className='detail-label'>Location: </div>
                    <div className='detail-data'>{job.location}</div>
                  </div>
                  <div className='detail'>
                    <div className='detail-label'>Notes: </div>
                    <div className='detail-data'>{job.notes}</div>
                  </div>                      
                </article>

                <img className="job-map" src={`https://www.mapquestapi.com/staticmap/v5/map?key=SboTAEZ9t8caAhRqQ3GSGWNmmcCz1Ag8&locations=${job.location}&zoom=12`} alt="office-map-marker"></img>

              </div>
            ))
          ) : (
            <p>No jobs assigned for today.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TodayDetail;
