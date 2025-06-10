import React, { useState, useEffect, useMemo } from 'react';

import SingleDate from './SingleDate';
import JobForm from './JobForm';
import DetailView from './DetailView';

// axios imports
import { getAllRigs, getAssignedAndUnassignedJobs } from '../../axios-services/index';

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
  
  // array to store month names to convert from numbers for label at top of calendar
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

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
    // Add placeholders for the previous month
    for (let i = startHolders; i > 0; i--) {
      const prevMonth = month === 0 ? 11 : month - 1; // Handle January (month 0)
      const prevYear = month === 0 ? year - 1 : year; // Handle year change for January
      const textMonth = updateDateNum(prevMonth + 1); // Convert to 1-based month
      const textDay = updateDateNum(daysLastMonth - i + 1);
      dateHolderArray.push(`${prevYear}-${textMonth}-${textDay}`);
    }

    // Add dates for the current month
    for (let i = 0; i < daysInMonth; i++) {
      const textMonth = updateDateNum(month + 1); // Convert to 1-based month
      const textDay = updateDateNum(i + 1);
      dateHolderArray.push(`${year}-${textMonth}-${textDay}`);
    }

    // Add placeholders for the next month
    for (let i = 0; i < endHolders; i++) {
      const nextMonth = (month + 1) % 12; // Handle December (month 11)
      const nextYear = month === 11 ? year + 1 : year; // Handle year change for December
      const textMonth = updateDateNum(nextMonth + 1); // Convert to 1-based month
      const textDay = updateDateNum(i + 1);
      dateHolderArray.push(`${nextYear}-${textMonth}-${textDay}`);
    }
    // return the array of date labels
    return dateHolderArray;
  }

  // state for handling the calendar display
  const [currentMonth, setCurrentMonth] = useState(centralTime.getUTCMonth());
  const [currentYear, setCurrentYear] = useState(centralTime.getUTCFullYear());
  const [displayMonthDates, setDisplayMonthDates] = useState(() => createDateArray(currentYear, currentMonth));
  const [displayWeekDates, setDisplayWeekDates] = useState(() => {
    const startOfWeek = new Date(centralTime);
    startOfWeek.setDate(centralTime.getDate() - centralTime.getUTCDay());
    startOfWeek.setHours(0, 0, 0, 0); // set time to midnight
  
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999); // Set time to the end of the day
  
    const weekDates = [];
    for (let d = new Date(startOfWeek); d <= endOfWeek; d.setDate(d.getDate() + 1)) {
      const year = d.getUTCFullYear();
      const month = d.getUTCMonth() + 1; // Convert to 1-based month
      const day = d.getUTCDate();
      weekDates.push(`${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`);
    }
    return weekDates;
  });
  const [displaySingleDate, setDisplaySingleDate] = useState(() => {
    const today = `${centralTime.getUTCFullYear()}-${(centralTime.getUTCMonth() + 1).toString().padStart(2, '0')}-${centralTime.getUTCDate().toString().padStart(2, '0')}`;
    return displayWeekDates.includes(today) ? today : today;
  });

  // Memoize the week description string for use in the calendar header display
  const weekDescription = useMemo(() => {
    if (displayWeekDates.length === 0) return '';

    // Extract the start and end dates
    const startDate = new Date(displayWeekDates[0]);
    const endDate = new Date(displayWeekDates[displayWeekDates.length - 1]);

    // Get the month names and day numbers
    const startMonthName = monthNames[startDate.getUTCMonth()];
    const startDay = startDate.getUTCDate();
    const endMonthName = monthNames[endDate.getUTCMonth()];
    const endDay = endDate.getUTCDate();

    // Format the string
    if (startMonthName === endMonthName) {
      return `${startMonthName} ${startDay}-${endDay}`;
    } else {
      return `${startMonthName} ${startDay} - ${endMonthName} ${endDay}`;
    }
  }, [displayWeekDates, monthNames]);

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
  const viewButtons = (e) => {
    let newYear = currentYear;
    let newMonth = currentMonth;
  
    if (viewType === 'month') {
      // Handle month navigation
      if (e.currentTarget.id === 'prevView') {
        newMonth -= 1;
      }
      if (e.currentTarget.id === 'nextView') {
        newMonth += 1;
      }
  
      if (newMonth < 0) {
        newMonth += 12;
        newYear -= 1;
      }
      if (newMonth > 11) {
        newMonth -= 12;
        newYear += 1;
      }
  
      setCurrentMonth(newMonth);
      setCurrentYear(newYear);
      setDisplayMonthDates(createDateArray(newYear, newMonth));

      // Update week and single date to align with the new month
      const firstDateOfMonth = `${newYear}-${(newMonth + 1).toString().padStart(2, '0')}-01`;
      const firstDateObj = new Date(firstDateOfMonth);
      const startOfWeek = new Date(firstDateObj);
      startOfWeek.setDate(firstDateObj.getDate() - firstDateObj.getUTCDay());
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);

      const newWeekDates = [];
      for (let d = new Date(startOfWeek); d <= endOfWeek; d.setDate(d.getDate() + 1)) {
        const year = d.getUTCFullYear();
        const month = d.getUTCMonth() + 1; // Convert to 1-based month
        const day = d.getUTCDate();
        newWeekDates.push(`${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`);
      }

      setDisplayWeekDates(newWeekDates);
      setDisplaySingleDate(newWeekDates[0]); // Default to the first date of the new week

    } else if (viewType === 'week'){
      // Handle week navigation
      const currentStartOfWeek = new Date(displayWeekDates[0]);
      if (e.currentTarget.id === 'prevView') {
        currentStartOfWeek.setDate(currentStartOfWeek.getDate() - 7); // Go back one week
      }
      if (e.currentTarget.id === 'nextView') {
        currentStartOfWeek.setDate(currentStartOfWeek.getDate() + 7); // Go forward one week
      }

      const newStartOfWeek = new Date(currentStartOfWeek);
      const newEndOfWeek = new Date(newStartOfWeek);
      newEndOfWeek.setDate(newStartOfWeek.getDate() + 6);

      const newWeekDates = [];
      for (let d = new Date(newStartOfWeek); d <= newEndOfWeek; d.setDate(d.getDate() + 1)) {
        const year = d.getUTCFullYear();
        const month = d.getUTCMonth() + 1; // Convert to 1-based month
        const day = d.getUTCDate();
        newWeekDates.push(`${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`);
      }

      setDisplayWeekDates(newWeekDates);
      setDisplaySingleDate(newWeekDates[0]); // Default to the first date of the new week

      // Check if the new week spills into a new month
      const newWeekMonth = newStartOfWeek.getUTCMonth();
      const newWeekYear = newStartOfWeek.getUTCFullYear();
      if (newWeekMonth !== currentMonth || newWeekYear !== currentYear) {
        setCurrentMonth(newWeekMonth);
        setCurrentYear(newWeekYear);
        setDisplayMonthDates(createDateArray(newWeekYear, newWeekMonth));
      }

    } else if (viewType === 'day') {
      // Handle day navigation
      const currentDate = new Date(displaySingleDate);
      if (e.currentTarget.id === 'prevView') {
        currentDate.setDate(currentDate.getDate() - 1); // Go back one day
      }
      if (e.currentTarget.id === 'nextView') {
        currentDate.setDate(currentDate.getDate() + 1); // Go forward one day
      }

      const year = currentDate.getUTCFullYear();
      const month = currentDate.getUTCMonth() + 1; // Convert to 1-based month
      const day = currentDate.getUTCDate();
      const newSingleDate = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;

      setDisplaySingleDate(newSingleDate);

      // Check if the new date spills into a new week
      const startOfWeek = new Date(currentDate);
      startOfWeek.setDate(currentDate.getDate() - currentDate.getUTCDay());
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);

      const newWeekDates = [];
      for (let d = new Date(startOfWeek); d <= endOfWeek; d.setDate(d.getDate() + 1)) {
        const weekYear = d.getUTCFullYear();
        const weekMonth = d.getUTCMonth() + 1; // Convert to 1-based month
        const weekDay = d.getUTCDate();
        newWeekDates.push(`${weekYear}-${weekMonth.toString().padStart(2, '0')}-${weekDay.toString().padStart(2, '0')}`);
      }

      setDisplayWeekDates(newWeekDates);

      // Check if the new day spills into a new month
      const newDayMonth = currentDate.getUTCMonth();
      const newDayYear = currentDate.getUTCFullYear();
      if (newDayMonth !== currentMonth || newDayYear !== currentYear) {
        setCurrentMonth(newDayMonth);
        setCurrentYear(newDayYear);
        setDisplayMonthDates(createDateArray(newDayYear, newDayMonth));
      }
    }
  };

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
  // console.log('detail view in calendar', detailView);
  // console.log('view type', viewType);
  // console.log('displayMonthDates', displayMonthDates);
  // console.log('displayWeekDates', displayWeekDates);
  // console.log('displaySingleDate', displaySingleDate);

  let viewContent;
  if (viewType === 'month') {
    viewContent = (
      <div className='month-grid'>
        {
          displayMonthDates.map((specificDate,index) => (
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
                viewType={viewType}
              />
            </div>
          ))
        }
      </div>
    );
  } else if (viewType === 'week') {
    viewContent = (
      <div className='month-grid'>
        {
          displayWeekDates.map((specificDate,index) => (
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
                viewType={viewType}
              />
            </div>
          ))
        }
      </div>
    );
  } else if (viewType === 'day') {
    viewContent = (
      <div className='no-grid'>
        <div className='day' key={displaySingleDate}>
          <SingleDate
            currentMonth={currentMonth}
            specificDate={displaySingleDate}
            jobList={jobList}
            setJobList={setJobList}
            rigList={rigList}
            showDetail={showDetail}
            setShowDetail={setShowDetail}
            setDetailView={setDetailView}
            viewType={viewType}
          />
        </div>
      </div>
    );
  }

  return (
    <div className='calendar-page'>
      {
        (jobList.length === 0 || rigList.length === 0) ? (
          <div>Loading...</div> // Show a loading message or spinner while data is being fetched
        ) : (
          <>
            <div className='calendar-header'>
              <div className='view-group-selector'>
                <select 
                  id="view"
                  name="view"
                  title='Select View'
                  className='view-selector'
                  value={viewType}
                  onChange={({ target: { value } }) => setViewType(value)}
                >
                  <option value="month">Month</option>
                  <option value="week">Week</option>
                  <option value="day">Day</option>
                </select>
                <button id='prevView' className='view-arrow' onClick={viewButtons} title='Previous'>
                  <i className="fa fa-arrow-left" aria-hidden="true"></i>
                </button>
                <button id='nextView' className='view-arrow' onClick={viewButtons} title='Next'>
                  <i className="fa fa-arrow-right" aria-hidden="true"></i>
                </button>
                <div className='current-view'>
                  {
                    viewType === 'day' ? (
                      <div style={{position: 'relative'}}>
                        <input
                          className='month-date-input'
                          type='date' 
                          id='current-date-view'
                          placeholder=''
                          value={displaySingleDate}
                          onChange={({ target: { value } }) => setDisplaySingleDate(value)}
                        >
                        </input>
                        <button
                          className="custom-calendar-button"
                          onClick={() => document.getElementById('current-date-view').showPicker()}
                        >
                          <i className="fa-regular fa-calendar"></i>
                        </button>
                      </div>
                      
                    ) : viewType === 'week' ? (
                      weekDescription
                    ) : viewType === 'month' ? (
                      `${monthNames[currentMonth]} ${currentYear}`
                    ) : null
                  }
                </div>
              </div>
              <div className="calendar-form-controller">
                {
                  formType === 'edit-job' ? (
                    <button id='cancel-edit' className='calendar-form-button' onClick={calendarFormButton}>Cancel Editing</button>
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
                {  
                  viewType !== 'day' ? (
                    <div className='day-of-week'>
                      <div className='dayName'>Sun</div>
                      <div className='dayName'>Mon</div>
                      <div className='dayName'>Tues</div>
                      <div className='dayName'>Wed</div>
                      <div className='dayName'>Thur</div>
                      <div className='dayName'>Fri</div>
                      <div className='dayName'>Sat</div>
                    </div>
                  ) : null
                }
                {viewContent}
              </div>
                {
                  (formType === 'unassigned') ? (                
                      <div className='unassigned-joblist'>
                        {
                          unassignedJobList.map((job, index) => (
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
                          ))
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
          </>
        )
      }
    </div>
  );

}

export default Calendar;

