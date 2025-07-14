import React, { useState, useEffect, useMemo } from 'react';

import { getAllRigs, getAssignedJobs } from '../../axios-services/index';

import DetailView from '../admin/DetailView';
import MiniJobCard from './MiniJobCard';

const CrewCalendar = ({token, user, setLoading}) => {

  // Central Time helper
  const getCentralTime = () => {
    const now = new Date();
    const centralOffset = -6;
    const isDST = now.getTimezoneOffset() < 300;
    const centralTime = new Date(now.getTime() + (centralOffset + (isDST ? 1 : 0)) * 60 * 60 * 1000);
    return centralTime;
  };
  const centralTime = getCentralTime();

  // Create week date array
  const createWeekDates = (startDate) => {
    const weekDates = [];
    const startOfWeek = new Date(startDate);
    startOfWeek.setHours(0, 0, 0, 0);
    for (let i = 0; i < 7; i++) {
      const d = new Date(startOfWeek);
      d.setDate(startOfWeek.getDate() + i);
      const year = d.getUTCFullYear();
      const month = d.getUTCMonth() + 1;
      const day = d.getUTCDate();
      weekDates.push(`${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`);
    }
    return weekDates;
  };

  // State for week view
  const [displayWeekDates, setDisplayWeekDates] = useState(() => {
    const startOfWeek = new Date(centralTime);
    startOfWeek.setDate(centralTime.getDate() - centralTime.getUTCDay());
    return createWeekDates(startOfWeek);
  });

  // Memoize week description
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const dayNames = ['Sun', 'Mon', 'Tues', 'Wed', 'Thur', 'Fri', 'Sat'];
  const weekDescription = useMemo(() => {
    if (displayWeekDates.length === 0) return '';
    const startDate = new Date(displayWeekDates[0]);
    const endDate = new Date(displayWeekDates[displayWeekDates.length - 1]);
    const startMonthName = monthNames[startDate.getUTCMonth()];
    const startDay = startDate.getUTCDate();
    const endMonthName = monthNames[endDate.getUTCMonth()];
    const endDay = endDate.getUTCDate();
    return startMonthName === endMonthName
      ? `${startMonthName} ${startDay}-${endDay}`
      : `${startMonthName} ${startDay} - ${endMonthName} ${endDay}`;
  }, [displayWeekDates, monthNames]);

  // Main content state
  const [jobList, setJobList] = useState([]);
  const [assignedRig, setAssignedRig] = useState({});
  const [detailView, setDetailView] = useState({});
  const [showDetail, setShowDetail] = useState(false);

  // Fetch jobs and rigs
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [jobs, rigs] = await Promise.all([
          getAssignedJobs(token),
          getAllRigs(token),
        ]);
        setJobList(jobs.filter(job => job.rigId === user.rigId)); 
        setAssignedRig(rigs.find(rig => rig.id === user.rigId) || {});
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [token,user]);

  // Week navigation
  const viewButtons = (e) => {
    const currentStartOfWeek = new Date(displayWeekDates[0]);
    if (e.currentTarget.id === 'prevView') {
      currentStartOfWeek.setDate(currentStartOfWeek.getDate() - 7);
    }
    if (e.currentTarget.id === 'nextView') {
      currentStartOfWeek.setDate(currentStartOfWeek.getDate() + 7);
    }
    setDisplayWeekDates(createWeekDates(currentStartOfWeek));
  };

  // Helper for day label
  const getDateParts = (specificDate) => {
    const parts = specificDate.split('-');
    if (parts[2][0] === '0') {
      parts[2] = parts[2].slice(1);
    }
    return parts;
  };


  // Only week view (vertical)
  const viewContent = (
    <div className='week-grid-vertical'>
      {displayWeekDates.map((specificDate, index) => {
        const dateParts = getDateParts(specificDate);
        return (
          <div className='week-row' key={specificDate}>
            <div className='vertical-day-label'>
              <span className="vertical-day-number">{dateParts[2]}</span>
              <span>{dayNames[index]}</span>
            </div>
            <div className='week-job-cell'>
              <MiniJobCard 
                jobList={jobList} 
                assignedRig={assignedRig} 
                specificDate={specificDate}
              />
            </div>
          </div>
        );
      })}
    </div>
  );

console.log('CrewCalendar jobList', jobList);

  return (
    <div className='calendar-page crew-calendar'>
      <div className='calendar-header'>
        <div className='mobile-view-group-selector'>
          <button id='prevView' className='view-arrow' onClick={viewButtons} title='Previous'>
            <i className="fa fa-arrow-left" aria-hidden="true"></i>
          </button>
          <div className='current-view'>
            {weekDescription}
          </div>
          <button id='nextView' className='view-arrow' onClick={viewButtons} title='Next'>
            <i className="fa fa-arrow-right" aria-hidden="true"></i>
          </button>
        </div>
      </div>
      <div className='calendar-container'>
        {showDetail ? ( 
          <DetailView
            setDetailView={setDetailView}
            detailView={detailView}
            setCurrentSelected={setCurrentSelected}
            setShowDetail={setShowDetail}
          />) : null}
        <div className='crew-calendar-vertical'>
          {viewContent}
        </div>
      </div>
    </div>
  );
};

export default CrewCalendar;