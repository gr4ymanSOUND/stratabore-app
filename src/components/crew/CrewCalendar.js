import React, { useState, useEffect, useMemo } from 'react';

import { getAllRigs, getAssignedJobs } from '../../axios-services/index';

import DetailView from '../admin/DetailView';
import MiniJobCard from './MiniJobCard';

const CrewCalendar = ({token, user, setLoading}) => {

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
  const [assignedRig, setAssignedRig] = useState({});
  const [currentSelected, setCurrentSelected] = useState({});
  const [detailView, setDetailView] = useState({});
  const [showDetail, setShowDetail] = useState(false);
  const [viewType, setViewType] = useState('month');

  // uses the token to pull the job and rig lists
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [jobs, rigs] = await Promise.all([
          getAssignedJobs(token),
          getAllRigs(token),
        ]);
        // temporarily setting the job list and assigned rig to only jobs for rig 1, this will be adjusted later to use the assigned rig for the user
        setJobList(jobs.filter(job => job.rigId === 1)); 
        setAssignedRig(rigs.find(rig => rig.id === 1) || {});
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
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


      // Check if the new week spills into a new month
      const newWeekMonth = newStartOfWeek.getUTCMonth();
      const newWeekYear = newStartOfWeek.getUTCFullYear();
      if (newWeekMonth !== currentMonth || newWeekYear !== currentYear) {
        setCurrentMonth(newWeekMonth);
        setCurrentYear(newWeekYear);
        setDisplayMonthDates(createDateArray(newWeekYear, newWeekMonth));
      }

    } 
  };

  const getDateParts = (specificDate, currentMonth) => {
    const parts = specificDate.split('-');
    if (parts[2][0] === '0') {
      parts[2] = parts[2].slice(1);
    }
    if (parseInt(parts[1], 10) !== currentMonth + 1) {
      parts[2] = `(${parts[2]})`;
    }
    return parts;
  };

  let viewContent;
  if (viewType === 'month') {
    viewContent = (
      <div className='month-grid'>
        {
          displayMonthDates.map((specificDate,index) => {
          const dateParts = getDateParts(specificDate, currentMonth);
            return (
              <div className='day' key={specificDate}>
                <div className='day-label'>{dateParts[2]}</div>
                <MiniJobCard 
                  jobList={jobList} 
                  assignedRig={assignedRig} 
                  specificDate={specificDate}
                  viewType={viewType}
                />
              </div>
            );
          })
        }
      </div>
    );
  } else if (viewType === 'week') {
    viewContent = (
      <div className='month-grid'>
        {
          displayWeekDates.map((specificDate,index) => {
          const dateParts = getDateParts(specificDate, currentMonth);
            return (
                <div className='day' key={specificDate}>
                  <div className='day-label'>{dateParts[2]}</div>
                  <MiniJobCard 
                    jobList={jobList} 
                    assignedRig={assignedRig} 
                    viewType={viewType}
                  />
                </div>
            );
          })
        }
      </div>
    );
  }

  console.log('jobList', jobList);
  console.log('assignedRig', assignedRig);

  return (
    <div className='calendar-page'>
      {
        (jobList.length === 0) ? (
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
                </select>
                <button id='prevView' className='view-arrow' onClick={viewButtons} title='Previous'>
                  <i className="fa fa-arrow-left" aria-hidden="true"></i>
                </button>
                <button id='nextView' className='view-arrow' onClick={viewButtons} title='Next'>
                  <i className="fa fa-arrow-right" aria-hidden="true"></i>
                </button>
                <div className='current-view'>
                  {
                    viewType === 'week' ? (
                      weekDescription
                    ) : viewType === 'month' ? (
                      `${monthNames[currentMonth]} ${currentYear}`
                    ) : null
                  }
                </div>
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
            </div>
          </>
        )
      }
    </div>
  );
};

export default CrewCalendar;