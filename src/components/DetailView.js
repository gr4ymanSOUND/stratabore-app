import React, { useEffect, useState } from 'react';



const DetailView = ({detailView, setFormType, setCurrentSelected}) => {

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

  const showDetailButton = (e) => {
    e.preventDefault();

    const detailID = e.target.id;
    console.log('detail id', detailID);

    if (!showDetail) {
      setDetailView({date: specificDate, id: detailID});
      setShowDetail(true);
    } else {
      setShowDetail(false);
      
    };
  }


  return(
    <div onClick={showDetailButton} className="day-rig-detail">
      <div className='rig-info' >
        <div>ID: {detailView.rig.id}</div>
        <div>{detailView.rig.licensePlate}</div>
        <div>{detailView.rig.rigType}</div>
        <div>{detailView.rig.status}</div>
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
  )
}

export default DetailView;