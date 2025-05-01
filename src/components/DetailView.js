import React, { useEffect, useState } from 'react';



const DetailView = ({detailView, setDetailView, formType, setFormType, setCurrentSelected, setShowDetail}) => {

  console.log('detail view in component', detailView);
  console.log('formtype in detail view', formType);

  const [detailJobs, setDetailJobs] = useState([]);

  useEffect(() => {
    const rigJobs = detailView.dayJobs.filter((job) => {
      if (job.rigId === detailView.rig.id) {
        return true;
      }
      return false;
    })
    setDetailJobs(rigJobs);
  },[detailView]);

  const boxStyle = {backgroundColor: `${detailView.rig.boardColor}`, border: 'none'};
  const containerStyle = {width: '100%'}
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
  if (formType !== ''){
    containerStyle.width = 'calc(100% - 325px)';
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