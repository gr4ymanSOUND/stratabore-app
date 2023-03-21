import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';

import SingleDate from './SingleDate';

// axios imports
import { getAllJobs } from '../axios-services/index';

const Calendar = ({token}) => {
  // will use imported token for pulling data

  // current month and year for filtering the job list while generating the date components
  const [currentMonth, setCurrentMonth] = useState('');
  const [currentYear, setCurrentYear] = useState('');
  const [jobList, setJobList] = useState([]);

  // array to store month names to convert from numbers for label at top of calendar
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

  // uses the token to pull the job list, and set the date to current if there's nothing there
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const jobs = await getAllJobs(token);
        setJobList(jobs);
      } catch (error) {
        console.log(error);
      }
    }
    fetchJobs();
    if (!currentMonth) {
      const d = new Date();
      setCurrentMonth(d.getUTCMonth());
      setCurrentYear(d.getUTCFullYear());
    }
  }, []);

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

    // use the data above to create an array with a label for each date on the grid
    const dateHolderArray = [];

    // find the number of days in the previous month to use for creating startHolders
    const daysLastMonth = new Date(year, month, 0).getUTCDate();
    for (let i = startHolders; i > 0; i--) {
      dateHolderArray.push(`${year}-${month}-${daysLastMonth - i + 1}`);
    }
    for (let i = 0; i < daysInMonth; i++) {
      dateHolderArray.push(`${year}-${ (month + 1) % 12 }-${i+1}`);
    }
    for (let i = 0; i < endHolders ;i++) {
      dateHolderArray.push(`${year}-${ (month + 2) % 12 }-${i+1}`);
    }
    // return the array of date labels
    return dateHolderArray;
  }

  const testDates = createDateArray(currentYear,currentMonth);

  return (
    <div className='calendar-container'>
      <div className='month-selector'>
        <button id='prevMonth' className='month-arrow' onClick={monthButtons}><i className="fa fa-arrow-left" aria-hidden="true"></i></button>
        <div className='current-monthYear'>{monthNames[currentMonth]} {currentYear}</div>
        <button className='month-arrow' id='nextMonth' onClick={monthButtons}><i className="fa fa-arrow-right" aria-hidden="true"></i></button>
      </div>
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
          testDates.map((specificDate,index) => {
            return (
              <div className='day' key={index}>
                <SingleDate
                  currentMonth={currentMonth}
                  specificDate={specificDate}
                  jobList={jobList}
                />
              </div>
            )
          })
        }

      </div>
    </div>
  )

}

export default Calendar;

