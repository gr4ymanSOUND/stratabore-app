import React, { useState } from 'react';

const CrewCalendar = ({token, user}) => {
  return (
    <div className='crew-page'>
      <div className="driller-view">
        <article>
          <h2>Crew Calendar</h2>
          <p>
            This will be a Week-by-Week calendar view of the jobs for the specific rig assigned to the driller, and will default to rig 1 during front-end testing before updating the database with the required fields and tables to link. It will be a more basic summary view to get an idea of the weeks workload and travel area, with the ability to view some more details of jobs. Similar to the week view in the admin calendar but with an adjusted view to account for only 1 rig being visible. Potentially this will just be a copy of the admin calendar entirely, just replacing the SingleDate and DateRig components and removing the ability to make changes.
          </p>
        </article>
      </div>
    </div>
    
  );
};

export default CrewCalendar;