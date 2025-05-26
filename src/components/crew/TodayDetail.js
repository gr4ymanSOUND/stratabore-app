import React, { useState } from 'react';

const TodayDetail = ({token, user}) => {
  return (
    <div className='crew-page'>
      <div className="driller-view">
        <article>
          <h2><strong>Today's Details:</strong></h2>
          <p>
            This will be a very detailed view of the current day's jobs, possibly including a small map square with an icon for the area for each job along with a notes field and a dropbox link field that have not been added to the database yet. I will include a date picker to choose a specific date to view.

            Like all 3 pages, it will default to rig ID #1 until front-end testing is done. Then the database will be updated with a link between rigs and users.
          </p>
        </article>
      </div>
    </div>
    
  );
};

export default TodayDetail;
