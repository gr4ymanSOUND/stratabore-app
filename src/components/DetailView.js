import React, { useEffect, useState } from 'react';



const DetailView = ({detailView, setDetailView, formType, setFormType, setCurrentSelected, setShowDetail}) => {

  console.log('detail view in component', detailView);
  console.log('formtype in detail view', formType);

  const [detailJobs, setDetailJobs] = useState([]);
  const [containerWidth, setContainerWidth] = useState('100vw');

  useEffect(() => {
    const rigJobs = detailView.dayJobs.filter((job) => job.rigId === detailView.rig.id);
    setDetailJobs(rigJobs);
  },[detailView]);

  useEffect(() => {
    const calculateContainerWidth = () => {
      const calendarPage = document.querySelector('.calendar-page');
      if (!calendarPage) return '100vw'; // Fallback if the element is not found

      const formWidth = formType !== '' ? 300 : 0; // Assume form width is 300px
      const padding = parseFloat(getComputedStyle(calendarPage).paddingLeft) + parseFloat(getComputedStyle(calendarPage).paddingRight);
      const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth; // Scroll bar width
      return `calc(100vw - ${formWidth + padding + scrollBarWidth +7}px)`;
    };

    setContainerWidth(calculateContainerWidth());

    // Recalculate on window resize
    const handleResize = () => setContainerWidth(calculateContainerWidth());
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [formType]); // Recalculate when formType changes

  const containerStyle = {
    width: containerWidth,
  };


  const boxStyle = {backgroundColor: `${detailView.rig.boardColor}`, border: 'none'};
  if (detailJobs.length < 1) {
    boxStyle.backgroundColor = `darkgray`
  }
  if (detailView.rig.status == 'inactive') {
    boxStyle.border = '1px red solid';
    boxStyle.backgroundColor = `darkgray`
  }
  if (detailView.rig.status == 'repairs') {
    boxStyle.border = '1px green solid';
    boxStyle.backgroundColor = `darkgray`
  }


  // add actual button to the detail view for closing the window
  const closeDetailButton = (e) => {
    e.preventDefault();
    setShowDetail(false);
    setDetailView({});
  }


  return(
    <div className="rig-detail-container" style={containerStyle}>
      <div className='detail-box' style={boxStyle}>
      <div className='rig-info' >
        <div>ID: {detailView.rig.id}</div>
        <div>{detailView.rig.licensePlate}</div>
        <div>{detailView.rig.rigType}</div>
        <div>{detailView.rig.status}</div>
        <button id='close-view' className='calendar-form-button' onClick={closeDetailButton}>X</button>
      </div>
      {
        detailJobs.map((job, index) => {
        const editButton = (e) => {
          e.preventDefault();
          setFormType(e.currentTarget.id);
          setCurrentSelected(job);
        }
        return (
          <div key={job.jobNumber} className="rig-detail-job">
            <div>
              {job.jobNumber}
            </div>
            <div>
              <button id='edit-job' className='calendar-form-button' onClick={editButton}>
                      <i id='edit-job' className="fa-solid fa-pen-to-square"></i>
              </button>
            </div>
          </div>
        )
      })
      }
      </div>
    </div>
  )
}

export default DetailView;