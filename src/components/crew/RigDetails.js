import React, { useState } from 'react';

const RigDetails = ({token, user}) => {
  return (
    <div className='crew-page'>
      <div className="driller-view">
        <article>
          <h2>Rig Details</h2>
          <p>
            This is where you will see the details of the rig the user is currently assigned to, inlcuding maintenance and registration due dates, license plate, maybe even some other tracking like the equipment on board.

            Until the database is updated with the required fields and tables to link users and rigs, this will contain details of only rig ID# 1.
          </p>
        </article>
      </div>
    </div>
    
  );
};

export default RigDetails;