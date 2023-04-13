import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';

import { getAllUsers, editUser, removeUser } from '../axios-services';

const UserForm = ({formType, setFormType, currentSelected, setCurrentSelected, setUserList}) => {

  const [userName, setUserName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [userStatus, setUserStatus] = useState('');

  // when the current selection or formtype changes, adjust the state to reflect the change
  useEffect(() => {

    if (formType === "edit-user") {
      setUserName(currentSelected.userName);
      setFirstName(currentSelected.firstName);
      setLastName(currentSelected.lastName);
      setUserEmail(currentSelected.email);
      setIsAdmin(currentSelected.isAdmin);
      setIsChecked(currentSelected.isAdmin)
      setUserStatus(currentSelected.status);
    }

    // makes sure the form is empty when it is hidden
    if (formType == "") {
      setUserName('');
      setFirstName('');
      setLastName('');
      setUserEmail('');
      setIsAdmin(false);
      setIsChecked(false)
      setUserStatus('');
    }

  }, [formType, currentSelected])

  // listens to any submit event - either add or edit
  const submitListener = async (e) => {
    e.preventDefault();

    const newUser = {
      userName: userName,
      firstName: firstName,
      lastName: lastName,
      email: userEmail,
      isAdmin: isAdmin,
      status: userStatus
    }

    if (formType == 'add-user') {
      // const response = await addUser();
    }
    if (formType == 'edit-user') {
      const userId = currentSelected.id;
      const response = await editUser(token, userId, newUser)
    }
    
    //reset form state and close the form after sumbission
    setUserName('');
    setFirstName('');
    setLastName('');
    setUserEmail('');
    setIsAdmin(false);
    setIsChecked(false);
    setUserStatus('')
    setFormType("reset")

    // sets the edited user data into react state as the currently selected row - used on the database page to re-select the row after editing has finished
    setCurrentSelected(newUser);

    // reset the user list and see the newly added/edited data in the spreadsheet
    const newUserList = await getAllUsers(token);
    setUserList(newUserList);

  };

  // specifically listens to the delete button
  const deleteListener = async (e) => {
    e.preventDefault();

    // sanity check with the user before deleting
    if( confirm(`Are you sure you want to deactivate this User? \n ${currentSelected.userName}`) ) {
      // call the API to delete the user
      const userId = currentSelected.id;
      await removeUser(token, userId);

      // reset the selection and hide the form
      setCurrentSelected({});
      setFormType("reset")

      // reset the user list to include the changes
      const newUserList = await getAllUsers(token);
      setUserList(newUserList);
    }
  };

  // checkboxes require separate state for the "checked" attribute and the actual value it is supposed to represent
  const handleAdminChange = async (e) => {
    setIsAdmin(!isAdmin);
    setIsChecked(!isChecked);
  }

  return !formType ? null : (
    <>
      <form className='form-container' onSubmit={submitListener}>
        <div className='job-form'>
          <div className="input-section">
            <label className="input-label">UserName</label>
            <input
              type="text"
              value={userName}
              onChange={({ target: { value } }) => setUserName(value)}
              className="form-control"
              id="userName"
              placeholder="user2023"
            />
          </div>
          <div className="input-section">
            <label className="input-label">First Name</label>
            <input
              type="text"
              value={firstName}
              onChange={({ target: { value } }) => setFirstName(value)}
              className="form-control"
              id="firstName"
              placeholder="user"
            />
          </div>
          <div className="input-section">
            <label className="input-label">Last Name</label>
            <input
              type="text"
              value={lastName}
              onChange={({ target: { value } }) => setLastName(value)}
              className="form-control"
              id="lastName"
              placeholder="2023"
            />
          </div>
          <div className="input-section">
            <label className="input-label">Email</label>
            <input
              type="text"
              value={userEmail}
              onChange={({ target: { value } }) => setUserEmail(value)}
              className="form-control"
              id="userEmail"
              placeholder="user2023@stratabore.com"
            />
          </div>
          <div className='input-section checkbox'>
            <label className='input-label'>Admin</label>
            <input
              type="checkbox"
              id="isAdmin"
              name="isAdmin"
              checked={isChecked}
              onChange={handleAdminChange}
              />
          </div>
          <div className="input-section">
            <label className="input-label">Status</label>
            <select 
              id="userStatus"
              name="userStatus"
              value={userStatus}
              onChange={({ target: { value } }) => setUserStatus(value)}
            >
              <option value="inactive">Inactive</option>
              <option value="active">Active</option>
            </select>
          </div>
          <button className="submit-button" type='submit'>Save and Submit</button>
          {(formType === "edit-user") ? <button id='delete-user' onClick={deleteListener}>Remove User</button> : null}
        </div>
      </form>
    </>
  )

};

export default UserForm;