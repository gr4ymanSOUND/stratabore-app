import React, { useEffect, useState } from 'react';

import { getAllRigs, editRig } from '../../axios-services';

const RigDetails = ({token, user, setLoading}) => {

  const [rigDetails, setRigDetails] = useState({});
  const [rigNotes, setRigNotes] = useState('');

  // helper that fetches the rig details and notes for the assigned rig
  const fetchData = async () => {
    setLoading(true);
    try {
      const [rigs] = await Promise.all([
        getAllRigs(token),
      ]);
      const rig = rigs.find(r => r.id === user.rigId) || {};
      setRigDetails(rig);
      setRigNotes(rig.notes || '');
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // useEffect to fetch rig details when the component mounts or when the user changes
  useEffect(() => {
    fetchData();
  }, [user]);

  // listens to the submit event to update the rig notes
  const submitListener = async (e) => {
    e.preventDefault();

    if (confirm('Are you sure you want to save your changes? The previous notes will be overwritten.')) {
      const newRig = {
        notes: rigNotes,
      }
      const response = await editRig(token, user.rigId, newRig)
      console.log('response', response);
      // re-fetch rig details after updating notes
      fetchData();
      alert('Notes updated successfully!');
    } else {
      alert('Changes were not saved.');
      // Reset the notes to the original value if not saved
      setRigNotes(rigDetails.notes || '');
    }

  };

  return (
    <div className='crew-page'>
      <div className="rig-view">
        <h2>Assigned Rig</h2>
        <form className='rig-details' onSubmit={submitListener}>
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
          <div className="detail">
            <label className="detail-label">Notes:</label>
            <textarea
              value={rigNotes}
              onChange={({ target: { value } }) => setRigNotes(value)}
              className="notes-textarea"
              id="notes"
              placeholder="needs new tires, augers in bad shape, etc."
            />
          </div>
          <button type='submit'>Save</button>
        </form>
      </div>
    </div>
    
  );
};

export default RigDetails;