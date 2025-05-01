import React, { useEffect, useState } from 'react';



const DetailView = ({detailView, setDetailView, setFormType, setCurrentSelected, setShowDetail}) => {

  console.log('detail view in component', detailView);

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

  const style = {backgroundColor: `${detailView.rig.boardColor}`, border: 'none'};
  if (detailJobs.length < 1) {
    style.backgroundColor = `darkgray`
  }
  if (detailView.rig.status == 'inactive') {
    style.border = '1px red solid';
    style.backgroundColor = `darkgray`
  }
  if (detailView.rig.status == 'repairs') {
    style.border = '1px green solid';
    style.backgroundColor = `darkgray`
  }


  // add actual button to the detail view for closing the window
  const closeDetailButton = (e) => {
    e.preventDefault();
    setShowDetail(false);
    setDetailView({});
  }


  return(
    <div className="rig-detail-container">
      <div className='detail-box' style={style}>
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
          setFormType(e.target.id);
          setCurrentSelected(job);
        }
        const unassignButton = async (e) => {
          e.preventDefault();
          const jobToUnassign = { jobId: job.id, rigId: job.rigId, jobDate: job.jobDate }
          if (confirm(`Are you sure you want to unassign this job? \n Job:${jobToUnassign.jobId}, Rig:${jobToUnassign.rigId}, Date: ${jobToUnassign.jobDate}`)) {
            const unassignedJob = await deleteJobRig(token, jobToUnassign);
            setFormType(e.target.id);
            // reload the joblist to reflect the changes in the spreadsheet
            const newJobList = await getAssignedAndUnassignedJobs(token)
            setJobList(newJobList);
          }
        }
        return (
          <div key={job.jobNumber} className="rig-detail-job">
            <div>
              {job.jobNumber}
            </div>
            <div>
              <button id='edit-job' className='calendar-form-button' onClick={editButton}>Edit</button>
              <button id='unassigned' className='calendar-form-button' onClick={unassignButton}>Unassign</button>
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