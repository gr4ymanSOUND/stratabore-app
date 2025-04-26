import React, { useState, useEffect } from 'react';

import SingleDate from './SingleDate';
import JobForm from './JobForm';
import DetailView from './DetailView';

// axios imports
import { getAllRigs, getAssignedAndUnassignedJobs } from '../axios-services/index';

const Calendar = ({token}) => {
  // will use imported token for pulling data

  // creating a date object to set the current date on startup
  const d = new Date();

  // current month and year for filtering the job list while generating the date components
  const [currentMonth, setCurrentMonth] = useState(d.getUTCMonth());
  const [currentYear, setCurrentYear] = useState(d.getUTCFullYear());

  // main content state
  const [jobList, setJobList] = useState([]);
  const unassignedJobList = jobList.filter((job) => {
    if (job.rigId === null) {return true}
      return false;
  });
  const [rigList, setRigList] = useState([]);
  const [formType, setFormType] = useState('');
  const [currentSelected, setCurrentSelected] = useState({});
  const [detailView, setDetailView] = useState({});
  const [showDetail, setShowDetail] = useState(false);

  // array to store month names to convert from numbers for label at top of calendar
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

  // uses the token to pull the job list 
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const jobs = await getAssignedAndUnassignedJobs(token);
        setJobList(jobs);
      } catch (error) {
        console.log(error);
      }
    }
    fetchJobs();
    console.log('job render');
  }, []);

  // get the rig list to pass to each date for coloring and other data
  useEffect(() => {
    const fetchRigs = async () => {
      try {
        const rigs = await getAllRigs(token);
        setRigList(rigs);
      } catch (error) {
        console.log(error);
      }
    }
    fetchRigs();
    console.log('rig render');

  },[]);

  // couldn't get form to close after submitting, this does a forced check everytime the form is submitted 
  useEffect(() => {
    if (formType === 'reset') {
      setFormType('');
      setCurrentSelected({});
    }
  },[formType])

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
  const displayDates = createDateArray(currentYear,currentMonth);

  // deal with the buttons controlling the calendar form
  const calendarFormButton = (e) => {
    if (e.target.id === 'unassigned' && formType === '' && unassignedJobList.length > 0) {
      setFormType('unassigned');
    }
    if ( e.target.id === 'cancel-edit' || e.target.id === 'unassigned' && formType === 'unassigned') {
      setFormType('');
    }

    let selectedJob;
    if (e.target.id === 'edit-job') {
      if (e.target.dataset) {
        selectedJob = unassignedJobList.filter((job) => {
          if (job.id == e.target.dataset.jobId) {
            return true;
          }
          return false;
        })
        setCurrentSelected(selectedJob[0]);
      }
      setFormType('edit-job')
    }
  }

  // console.log('form', formType);
  // console.log('current selected', currentSelected);
  // console.log('jobList', jobList)
  // console.log('unassigned jobs', unassignedJobList);
  console.log('detail view in calendar', detailView);


  return (
    <div className='calendar-page'>
      <div className='calendar-header'>
        <div className='month-selector'>
          <button id='prevMonth' className='month-arrow' onClick={monthButtons}><i className="fa fa-arrow-left" aria-hidden="true"></i></button>
          <div className='current-monthYear'>{monthNames[currentMonth]} {currentYear}</div>
          <button className='month-arrow' id='nextMonth' onClick={monthButtons}><i className="fa fa-arrow-right" aria-hidden="true"></i></button>
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
          {
            showDetail ? ( 
            <DetailView
              detailView={detailView}
              setFormType={setFormType}
              setCurrentSelected={setCurrentSelected}
            />) : null
          }
          <div className='month-grid'>
            {
              displayDates.map((specificDate,index) => {
                return (
                  <div className='day' key={specificDate}>
                    <SingleDate
                      token={token}
                      currentMonth={currentMonth}
                      specificDate={specificDate}
                      jobList={jobList}
                      setJobList={setJobList}
                      rigList={rigList}
                      formType={formType}
                      setFormType={setFormType}
                      currentSelected={currentSelected}
                      setCurrentSelected={setCurrentSelected}
                      showDetail={showDetail}
                      setShowDetail={setShowDetail}
                      detailView={detailView}
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
                    return (
                      <div key={job.id} className='unassigned-job'>
                        <div className='job-num'>{job.jobNumber}</div>
                        <div>{job.location}</div>
                        <button id='edit-job' data-job-id={job.id} className='calendar-form-button' onClick={calendarFormButton}>Edit</button>
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
    </div>
  )

}

export default Calendar;

