import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';

import { getAllUsers, editUser, removeUser, createUser } from '../../axios-services';

const UserForm = ({token, formType, setFormType, currentSelected, setCurrentSelected, setUserList}) => {

  const [userName, setUserName] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [rigId, setRigId] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [userStatus, setUserStatus] = useState('active');

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
      if (currentSelected.rigId === undefined || currentSelected.rigId === null) {
        setRigId('');
      } else {
      setRigId(currentSelected.rigId);
      }
    }

    // makes sure the form is empty when it is hidden
    if (formType == "") {
      setUserName('');
      setUserPassword('');
      setFirstName('');
      setLastName('');
      setUserEmail('');
      setRigId('');
      setIsAdmin(false);
      setIsChecked(false)
      setUserStatus('active');
    }

  }, [formType, currentSelected])

  // listens to any submit event - either add or edit
  const submitListener = async (e) => {
    console.log('formType', formType);
    e.preventDefault();

    if (userName=='' || firstName=='' || lastName=='' || userEmail=='') {
      alert('Please fill in all available fields before submitting');
      return;
    }
    if (formType=='add-user' && userPassword=='') {
      alert('Please fill in all available fields before submitting');
      return;
    }

    const newUser = {
      userName: userName,
      password: userPassword,
      firstName: firstName,
      lastName: lastName,
      email: userEmail,
      rigId: rigId,
      isAdmin: isAdmin,
      status: userStatus
    }

    if (formType == 'add-user') {
      const response = await createUser(token, newUser);
      alert(`A new user for ${newUser.firstName} has been created.`);
    }
    if (formType == 'edit-user') {
      delete newUser.password;
      const userId = currentSelected.id;
      const response = await editUser(token, userId, newUser)
      if (typeof response === 'string') {
        alert(response);      }
      alert(`${newUser.userName} has been edited.`);
    }
    
    //reset form state and close the form after sumbission
    setUserName('');
    setUserPassword('');
    setFirstName('');
    setLastName('');
    setUserEmail('');
    setRigId('');
    setIsAdmin(false);
    setIsChecked(false);
    setUserStatus('active')
    setFormType("")

    // for this form, we will always unselect after submitting
    setCurrentSelected({});

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
      setFormType("")

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
      <form className='form-container admin-form' onSubmit={submitListener}>
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
          {
            formType === 'add-user' ? (
              <div className="input-section">
                <label className="input-label">Password</label>
                <input
                  type="text"
                  value={userPassword}
                  onChange={({ target: { value } }) => setUserPassword(value)}
                  className="form-control"
                  id="password"
                  placeholder="******"
                />
              </div>
            ) : null
          }
          
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
          {
            isAdmin ? null : (
              <div className="input-section">
                <label className="input-label">Rig ID:</label>
                <input
                  type="number"
                  value={rigId}
                  onChange={({ target: { value } }) => setRigId(value)}
                  className="form-control"
                  id="rigId"
                  min='0'
                  max='6'
                />
              </div>
            )
          }
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
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          <button className="submit-button" type='submit'>Save</button>
          {(formType === "edit-user") ? <button id='delete-user' onClick={deleteListener}>Remove User</button> : null}
        </div>
      </form>
    </>
  )

};

export default UserForm;