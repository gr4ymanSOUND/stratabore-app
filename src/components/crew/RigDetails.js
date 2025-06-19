import React, { useEffect, useState } from 'react';

import { getAllRigs } from '../../axios-services';

const RigDetails = ({token, user}) => {

  const [rigDetails, setRigDetails] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [rigs] = await Promise.all([
          getAllRigs(token),
        ]);
      // temporarily setting the details to rig 0, not the logged in user's rig since there is nothing to tell which rig they are assigned to in the database yet
      setRigDetails(rigs[0]);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [user]);

  console.log('rigDetails', rigDetails);

  return (
    <div className='crew-page'>
      <div className="rig-view">
        <h2>Assigned Rig</h2>
        <article className='rig-details'>
          <div className='detail'>
            <div className='detail-label'>License Plate: </div>
            <div className='detail-data'>{rigDetails.licensePlate}</div>
          </div>
          <div className='detail'>
            <div className='detail-label'>Type: </div>
            <div className='detail-data'>{rigDetails.rigType}</div>
          </div>
          <div className='detail'>
            <div className='detail-label'>Maintenance Due: </div>
            <div className='detail-data'>{rigDetails.maintenanceDueDate}</div>
          </div>
          <div className='detail'>
            <div className='detail-label'>Registration Due: </div>
            <div className='detail-data'>{rigDetails.registrationDueDate}</div>
          </div>
          <div className='detail'>
            <div className='detail-label'>Status: </div>
            <div className='detail-data'>{rigDetails.status}</div>
          </div>
        </article>
      </div>
    </div>
    
  );
};

export default RigDetails;