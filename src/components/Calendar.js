import React, { useState, useEffect, useMemo } from 'react';

import SingleDate from './SingleDate';
import JobForm from './JobForm';
import DetailView from './DetailView';

// axios imports
import { getAllRigs, getAssignedAndUnassignedJobs } from '../axios-services/index';

const Calendar = ({token}) => {
  // will use imported token for pulling data

  // creating a date object to set the current date on startup, adjusted to central time
  const getCentralTime = () => {
    const now = new Date();
    // Central Time is UTC-6 or UTC-5 depending on Daylight Saving Time
    const centralOffset = -6; // Base offset for Central Standard Time (CST)
    const isDST = now.getTimezoneOffset() < 300; // Check if Daylight Saving Time is active
    const centralTime = new Date(now.getTime() + (centralOffset + (isDST ? 1 : 0)) * 60 * 60 * 1000);
    return centralTime;
  };

  const centralTime = getCentralTime();

  // current month and year for filtering the job list while generating the date components
  const [currentMonth, setCurrentMonth] = useState(centralTime.getUTCMonth());
  const [currentYear, setCurrentYear] = useState(centralTime.getUTCFullYear());

  // main content state
  const [jobList, setJobList] = useState([]);
  // memoize the unassigned list since it's derived from the job list
  const unassignedJobList = useMemo(() => {
    return jobList.filter((job) => job.rigId === null);
  }, [jobList]);
  const [rigList, setRigList] = useState([]);
  const [formType, setFormType] = useState('');
  const [currentSelected, setCurrentSelected] = useState({});
  const [detailView, setDetailView] = useState({});
  const [showDetail, setShowDetail] = useState(false);
  const [viewType, setViewType] = useState('month');

  // array to store month names to convert from numbers for label at top of calendar
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

  // uses the token to pull the job and rig lists
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [jobs, rigs] = await Promise.all([
          getAssignedAndUnassignedJobs(token),
          getAllRigs(token),
        ]);
        setJobList(jobs);
        setRigList(rigs);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [token]);

  // handles changing which month is displayed
  const monthButtons = (e) => {
    let newYear;
    let newMonth;
    // month logic
    if (e.currentTarget.id == 'prevMonth') {
      newMonth = currentMonth - 1;
    }
    if (e.currentTarget.id == 'nextMonth') {
      newMonth = currentMonth + 1;
    }
    // check if year needs to be updated
    if (newMonth < 0) {
      newMonth += 12;
      newYear = currentYear - 1;
      setCurrentYear(newYear);
    }
    if (newMonth > 11) {
      newMonth -= 12;
      newYear = currentYear + 1;
      setCurrentYear(newYear);
    }
    // set month to state after all other updates
    setCurrentMonth(newMonth);
  };

  // create an array with dates to use to generate the SingleDate components
  // need to pass in the current month and year
  const createDateArray = (year, month) => {
    // get number of days in the current month
    const daysInMonth = new Date(year, month + 1, 0).getUTCDate();
    
    // getUTCDay returns an index, use that to calc # of placeholders
    const startHolders = new Date(year, month, 1).getUTCDay();
    const endHolders = 6 - (new Date(year, month + 1, 0).getUTCDay());

    // find the number of days in the previous month to use for creating startHolders
    const daysLastMonth = new Date(year, month, 0).getUTCDate();

    // special logic to make sure the months have a leading zero if necessary for matching against the database
    const updateDateNum = (dateNumToCheck) => {
      let newDateNum;
      if (parseInt(dateNumToCheck) < 10) {
        newDateNum = '0' + dateNumToCheck;
        return newDateNum
      }
      return dateNumToCheck;
    }

    // use the data above to create an array with a label for each date on the grid
    const dateHolderArray = [];
    for (let i = startHolders; i > 0; i--) {
      let textMonth = updateDateNum(month);
      dateHolderArray.push(`${year}-${textMonth}-${daysLastMonth - i + 1}`);
    }
    for (let i = 0; i < daysInMonth; i++) {
      let newMonth = (month + 1) % 12;
      let textMonth = updateDateNum(newMonth);
      let textDay = updateDateNum(i+1)
      dateHolderArray.push(`${year}-${textMonth}-${textDay}`);
    }
    for (let i = 0; i < endHolders ;i++) {
      let newMonth = (month + 2) % 12;
      let textMonth = updateDateNum(newMonth);
      dateHolderArray.push(`${year}-${textMonth}-${i+1}`);
    }
    // return the array of date labels
    return dateHolderArray;
  }
  //memoize the state so it doesn't change unless the month or year changes
  const displayDates = useMemo(() => {
    return createDateArray(currentYear, currentMonth);
  }, [currentYear, currentMonth]);

  // deal with the buttons controlling the calendar form
  const calendarFormButton = (e) => {
    if ( e.currentTarget.id === 'cancel-edit' || e.currentTarget.id === 'unassigned' && formType === 'unassigned') {
      setFormType('');
    }
    if (e.currentTarget.id === 'unassigned' && formType === '' && unassignedJobList.length > 0) {
      setFormType('unassigned');
    }

    if (e.currentTarget.id === 'edit-job') {
      if (e.currentTarget.dataset.jobId) {
        const selectedJob = unassignedJobList.find((job) => {
          if (job.id == e.currentTarget.dataset.jobId) {
            return true;
          }
          return false;
        })
        setCurrentSelected(selectedJob);
      }
      setFormType('edit-job')
    }
  }

  // console.log('form', formType);
  // console.log('current selected', currentSelected);
  // console.log('jobList', jobList)
  // console.log('unassigned jobs', unassignedJobList);
  console.log('detail view in calendar', detailView);
  console.log('current selected', currentSelected);
  console.log('view type', viewType);


  return (
    <div className='calendar-page'>
      {
      (jobList.length === 0 || rigList.length === 0) ? (
        <div>Loading...</div> // Show a loading message or spinner while data is being fetched
      ) : (
        <>
          <div className='calendar-header'>
            <div className='month-selector'>
              <button id='prevMonth' className='month-arrow' onClick={monthButtons}><i className="fa fa-arrow-left" aria-hidden="true"></i></button>
              <div className='current-monthYear'>{monthNames[currentMonth]} {currentYear}</div>
              <button className='month-arrow' id='nextMonth' onClick={monthButtons}><i className="fa fa-arrow-right" aria-hidden="true"></i></button>
            </div>
            <div className='view-selector'>
              <select 
                id="view"
                name="view"
                value={viewType}
                onChange={({ target: { value } }) => setViewType(value)}
              >
                <option value="month">Month</option>
                <option value="week">Week</option>
                <option value="day">Day</option>
              </select>
            </div>
            <div className="calendar-form-controller">
              {
                formType === 'edit-job' ? (
                  <button id='cancel-edit' className='calendar-form-button' onClick={calendarFormButton}>Cancel Edit</button>
                ) : <button id='unassigned' className='calendar-form-button' onClick={calendarFormButton}>Unassigned Jobs ({unassignedJobList.length})</button>
              }
            </div>
          </div>
          <div className='calendar-container'>
          {
            showDetail ? ( 
            <DetailView
              setDetailView={setDetailView}
              detailView={detailView}
              formType={formType}
              setFormType={setFormType}
              setCurrentSelected={setCurrentSelected}
              setShowDetail={setShowDetail}
            />) : null
          }
            <div className='calendar'>
              <div className='day-of-week'>
                <div className='dayName'>Sun</div>
                <div className='dayName'>Mon</div>
                <div className='dayName'>Tues</div>
                <div className='dayName'>Wed</div>
                <div className='dayName'>Thur</div>
                <div className='dayName'>Fri</div>
                <div className='dayName'>Sat</div>
              </div>
              <div className='month-grid'>
                {
                  displayDates.map((specificDate,index) => {
                    return (
                      <div className='day' key={specificDate}>
                        <SingleDate
                          currentMonth={currentMonth}
                          specificDate={specificDate}
                          jobList={jobList}
                          setJobList={setJobList}
                          rigList={rigList}
                          showDetail={showDetail}
                          setShowDetail={setShowDetail}
                          setDetailView={setDetailView}
                        />
                      </div>
                    )
                  })
                }
              </div>
            </div>
            <div className='calendar-form'>
              {
                (formType === 'unassigned') ? (
                  <div className='unassigned-joblist'>
                    {
                      unassignedJobList.map((job, index) => {
                        // console.log('job in list', job)
                        return (
                          <div key={job.id} className='unassigned-job'>
                            <div className='job-num'>{job.jobNumber}</div>
                            <div>{job.location}</div>
                            <button 
                              id="edit-job" 
                              data-job-id={job.id} 
                              className="calendar-form-button"
                              onClick={calendarFormButton}
                            >
                              <i className="fa-solid fa-pen-to-square"></i>
                            </button>
                          </div>
                        )
                      })
                    }
                  </div>
                ) : (
                  <JobForm
                    token={token}
                    formType={formType}
                    setFormType={setFormType}
                    jobList={jobList}
                    setJobList={setJobList}
                    currentSelected={currentSelected}
                    setCurrentSelected={setCurrentSelected}
                  />
                )
              }
            </div>
          </div>
        </>
      )
    }
    </div>
  );

}

export default Calendar;

