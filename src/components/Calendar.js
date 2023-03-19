import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';


const Calendar = ({token}) => {
  // will use imported token for pulling data

  //fake month data for now
  const dates = [
    1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30
  ]

  const dates2 = [
    1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28
  ]


  return (
    <div className='calendar-container'>
      <div className='month-selector'>
        <button className='month-arrow'><i class="fa fa-arrow-left" aria-hidden="true"></i></button>
        <div className='current-monthYear'>MMM YYYY</div>
        <button className='month-arrow'><i class="fa fa-arrow-right" aria-hidden="true"></i></button>
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
        {/* <div className='day'>lastmonth</div>
        <div className='day'>lastmonth</div>
        <div className='day'>lastmonth</div>
        <div className='day'>lastmonth</div>
        <div className='day'>lastmonth</div>
        <div className='day'>lastmonth</div> */}

        {
        /* { code for generating data to feed to each "date" component} */
        dates2.map((date,index) => {
          return (
            <div className='day'>{date}</div>
          )
        })
        }
        {/* <div className='day'>nextmonth</div>
        <div className='day'>nextmonth</div>
        <div className='day'>nextmonth</div>
        <div className='day'>nextmonth</div>
        <div className='day'>nextmonth</div>
        <div className='day'>nextmonth</div> */}

      </div>
    </div>
  )

}

export default Calendar;

