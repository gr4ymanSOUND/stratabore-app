import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';

const DateRig = ({specificDate, rig, dayJobs, formType, setFormType, currentSelected, setCurrentSelected}) => {

  const [detailView, setDetailView] = useState(false);

  // this handles keeping the detail view open when the form opens for editing
  // only hide it if we're actually resetting the form completely
  useEffect(()=>{
    if (formType === 'edit-job' && currentSelected.rigId === rig.id && specificDate === currentSelected.jobDate && rigJobs.length > 0) {
      setDetailView(true);
    } else  if (formType === '') {
      setDetailView(false);
    }
  },[formType])


  // reset only the form type if canceling the edit view
  // this will run after the effect above due to the detail view changing
  useEffect(() => {
    if (detailView && formType === "cancel-edit") {
      setFormType('');
    }
  }, [detailView])

  
  // handles detail view toggling, only if there are jobs for that rig
  const showDetail = (e) => {
    if (rigJobs.length > 0 ){
      setDetailView(!detailView);
    }
  };

  // filter the dayJobs for the current rig
  const findRigJobs = (job) => {
    if (job.rigId === rig.id) {
      return true;
    }
    return false;
  };
  const rigJobs = dayJobs.filter(findRigJobs);

  // logic to determine which coloring option to use for the rig, depending on the number of jobs and rig status
  const style = {backgroundColor: `${rig.boardColor}`, border: 'none'};
  if (rigJobs.length < 1) {
    style.backgroundColor = `darkgray`
  }
  if (rig.status !== 'active') {
    style.border = '1px red solid';
    style.backgroundColor = `darkgray`
  }


  return (
    <>
      <div onClick={showDetail} className="day-rig" style={style}>
        {
          (rig.status !== 'active' || rigJobs.length < 1) ? (
            <div className='day-rig-id' style={{color: rig.boardColor}}>{rig.id}</div>
          ) : null
        }
        <div className='day-rig-count'>
          {`${rigJobs.length}`}
        </div>
        {
          detailView ? (
            <div onClick={showDetail} className="day-rig-detail" style={style}>
              <div className='rig-info' >
                <div>ID: {rig.id}</div>
                <div>{rig.licensePlate}</div>
                <div>{rig.rigType}</div>
                <div>{rig.status}</div>
              </div>
              {
              rigJobs.map((job, index) => {
                const editButton = (e) => {
                  setFormType(e.target.id);
                  setCurrentSelected(job);
                }
                return (
                  <div key={job.jobNumber} className="rig-detail-job">
                    <div>
                      {job.jobNumber}
                      <button id='edit-job' className='calendar-form-button' onClick={editButton}>Edit</button>
                    </div>
                  </div>
                )
              })
              }
            </div>
          ) : null
        }
      </div>
    </>
  )

};

export default DateRig;