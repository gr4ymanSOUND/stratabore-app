import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';

import { getAllRigs, editRig, removeRig } from '../axios-services';

const RigForm = ({token, formType, setFormType, currentSelected, setCurrentSelected, setRigList}) => {

  const [ licensePlate, setLicensePlate ] = useState('');
  const [ rigType, setRigType ] = useState('');
  const [ boardColor , setBoardColor ] = useState('');
  const [ rigStatus, setRigStatus ] = useState('');

  // when the current selection or formtype changes, adjust the state to reflect the change
  useEffect(() => {
    if (formType === "edit-rig") {
      setLicensePlate(currentSelected.licensePlate);
      setRigType(currentSelected.rigType);
      setBoardColor(currentSelected.boardColor);
      setRigStatus(currentSelected.status);
    }

    // makes sure the form is empty when it is hidden
    if (formType == "") {
      setLicensePlate('');
      setRigType('');
      setBoardColor('');
      setRigStatus('');
    }

  }, [formType, currentSelected])

  // listens to any submit event - either add or edit
  const submitListener = async (e) => {
    e.preventDefault();

    const newRig = {
      licensePlate: licensePlate,
      rigType: rigType,
      boardColor: boardColor,
      status: rigStatus
    }

    if (formType == 'add-rig') {
      // const response = await addRig();
    }
    if (formType == 'edit-rig') {
      console.log('current rig id', currentSelected.id)
      const rigId = currentSelected.id;
      const response = await editRig(token, rigId, newRig)
      console.log('edit rig submission, id: ', rigId, newRig);
    }
    
    //reset form state and close the form after sumbission
    setLicensePlate('');
    setRigType('');
    setBoardColor('');
    setRigStatus('');
    setFormType("reset")

    console.log('new rig', newRig)

    // sets the edited rig data into react state as the currently selected row - used on the database page to re-select the row after editing has finished
    setCurrentSelected(newRig);

    // reset the rig list and see the newly added/edited data in the spreadsheet
    const newRigList = await getAllRigs(token);
    setRigList(newRigList);

  };

  // specifically listens to the delete button
  const deleteListener = async (e) => {
    e.preventDefault();

    // sanity check with the user before deleting
    if( confirm(`Are you sure you want to deactivate this Rig? \n ${currentSelected.licensePlate}`) ) {
      // call the API to delete the rig
      const rigId = currentSelected.id;
      await removeRig(token, rigId);

      // reset the selection and hide the form
      setCurrentSelected({});
      setFormType("reset")

      // reset the rig list to include the changes
      const newRigList = await getAllRigs(token);
      setRigList(newRigList);
    }
  };

  return !formType ? null : (
    <>
      <form className='form-container' onSubmit={submitListener}>
        <div className='form-body'>
          <div className="input-section">
            <label className="input-label">Plate</label>
            <input
              type="text"
              value={licensePlate}
              onChange={({ target: { value } }) => setLicensePlate(value)}
              className="form-control"
              id="licensePlate"
              placeholder="XXX-0000"
            />
          </div>
          <div className="input-section">
            <label className="input-label">Type</label>
            <select 
              id="rigType"
              name="rigType"
              value={rigType}
              onChange={({ target: { value } }) => setRigType(value)}
            >
              <option value="lil">lil</option>
              <option value="mid">mid</option>
              <option value="big">big</option>
            </select>
          </div>
          <div className="input-section">
            <label className="input-label">Color</label>
            <select 
              id="boardColor"
              name="boardColor"
              value={boardColor}
              onChange={({ target: { value } }) => setBoardColor(value)}
            >
              <option value="red">red</option>
              <option value="green">green</option>
              <option value="blue">blue</option>
              <option value="orange">orange</option>
              <option value="purple">purple</option>
              <option value="yellow">yellow</option>
            </select>
          </div>
          <div className="input-section">
            <label className="input-label">Status</label>
            <select 
              id="rigStatus"
              name="rigStatus"
              value={rigStatus}
              onChange={({ target: { value } }) => setRigStatus(value)}
            >
              <option value="inactive">Inactive</option>
              <option value="repairs">In Repairs</option>
              <option value="active">Active</option>
            </select>
          </div>
          <button className="submit-button" type='submit'>Save and Submit</button>
          {(formType === "edit-rig") ? <button id='delete-rig' onClick={deleteListener}>Remove Rig</button> : null}
        </div>
      </form>
    </>
  )

};

export default RigForm;