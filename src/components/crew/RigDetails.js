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
      <div className="driller-view">
        <article>
          <h2>Rig Details</h2>
          <p>
            This is where you will see the details of the rig the user is currently assigned to, inlcuding maintenance and registration due dates, license plate, maybe even some other tracking like the equipment on board.

            Until the database is updated with the required fields and tables to link users and rigs, this will contain details of only rig ID# 1.
          </p>
          <ul>
            <li>Rig ID: {rigDetails.id}</li>
            <li>License Plate: {rigDetails.licensePlate}</li>
            <li>Maintenance Due Date: {rigDetails.maintenanceDueDate}</li>
            <li>Registration Due Date: {rigDetails.registrationDueDate}</li>
            <li>Type: {rigDetails.rigType}</li>
            <li>Status: {rigDetails.status}</li>
          </ul>
        </article>
      </div>
    </div>
    
  );
};

export default RigDetails;