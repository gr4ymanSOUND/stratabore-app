import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';

import { getAllRigs, editRig, removeRig, createRig } from '../axios-services';

const RigForm = ({token, formType, setFormType, currentSelected, setCurrentSelected, rigList, setRigList}) => {

  const [ licensePlate, setLicensePlate ] = useState('');
  const [ rigType, setRigType ] = useState('lil');
  const [ boardColor , setBoardColor ] = useState('');
  const [ registrationDueDate, setRegistrationDueDate ] = useState('');
  const [ maintenanceDueDate, setMaintenanceDueDate ] = useState('');
  const [ rigStatus, setRigStatus ] = useState('active');

  // when the current selection or formtype changes, adjust the state to reflect the change
  useEffect(() => {
    if (formType === "edit-rig") {
      setLicensePlate(currentSelected.licensePlate);
      setRigType(currentSelected.rigType);
      setBoardColor(currentSelected.boardColor);
      setRegistrationDueDate(currentSelected.registrationDueDate);
      setMaintenanceDueDate(currentSelected.maintenanceDueDate);
      setRigStatus(currentSelected.status);

    }

    // makes sure the form is empty when it is hidden
    if (formType == "") {
      setLicensePlate('');
      setRigType('');
      setBoardColor('');
      setRegistrationDueDate('');
      setMaintenanceDueDate('');
      setRigStatus('active');
    }

  }, [formType, currentSelected])

  // listens to any submit event - either add or edit
  const submitListener = async (e) => {
    e.preventDefault();

    if (licensePlate=='' || boardColor=='') {
      alert('Please fill in all available fields before submitting');
      return;
    }

    const newRig = {
      licensePlate: licensePlate,
      rigType: rigType,
      boardColor: boardColor,
      registrationDueDate: registrationDueDate,
      maintenanceDueDate: maintenanceDueDate,
      status: rigStatus
    }

    if (formType == 'add-rig') {
      const response = await createRig(token, newRig);
      alert('Adding Rigs is currently not supported')
    }
    if (formType == 'edit-rig') {
      const rigId = currentSelected.id;
      const response = await editRig(token, rigId, newRig)
    }
    
    //reset form state and close the form after sumbission
    setLicensePlate('');
    setRigType('');
    setBoardColor('');
    setRegistrationDueDate('');
    setMaintenanceDueDate('');
    setRigStatus('active');
    setFormType("reset")

   // for this form, we will always unselect after submitting
   setCurrentSelected({});

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
      <form className='form-container admin-form' onSubmit={submitListener}>
        <div className='job-form'>
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
            <input 
              type="text"
              value={boardColor}
              onChange={({ target: { value } }) => setBoardColor(value)}
              className="form-control"
              id="boardColor"
              placeholder="#FF0000 OR red"
            />
              {/* decided to use a text imput instead
              <option value="red">red</option>
              <option value="green">green</option>
              <option value="blue">blue</option>
              <option value="orange">orange</option>
              <option value="purple">purple</option>
              <option value="yellow">yellow</option>
            </select> */}
          </div>
          <div className="input-section">
            <label className="input-label">Registration Due:</label>
            <input
              type="date"
              value={registrationDueDate}
              onChange={({ target: { value } }) => setRegistrationDueDate(value)}
              className="form-control"
              id="registrationDate"
              placeholder=""
            />
          </div>
          <div className="input-section">
            <label className="input-label">Maintenance Due:</label>
            <input
              type="date"
              value={maintenanceDueDate}
              onChange={({ target: { value } }) => setMaintenanceDueDate(value)}
              className="form-control"
              id="maintenanceDate"
              placeholder=""
            />
          </div>
          <div className="input-section">
            <label className="input-label">Status</label>
            <select 
              id="rigStatus"
              name="rigStatus"
              value={rigStatus}
              onChange={({ target: { value } }) => setRigStatus(value)}
            >
              <option value="active">Active</option>
              <option value="repairs">In Repairs</option>
              <option value="inactive">Inactive</option>
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