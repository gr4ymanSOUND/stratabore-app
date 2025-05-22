import React, { useState, useEffect } from 'react';
import { editUser, getMe } from "../axios-services";

const EditAccount = ({ token, user, setUser}) => {

  const [userId, setUserId] = useState(0);
  const [userName, setUserName] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [userStatus, setUserStatus] = useState('active');

  
  useEffect(()=>{
    if (!user) return;
      setUserId(user.id || 0);
      setUserName(user.userName || '');
      setFirstName(user.firstName || '');
      setLastName(user.lastName || '');
      setUserEmail(user.email || '');
      setIsAdmin(user.isAdmin || false);
      setIsChecked(user.isAdmin || false);
      setUserStatus(user.status || 'active');
  },[user])

  const submitListener = async (e) => {
    e.preventDefault();

    if (userName=='' || firstName=='' || lastName=='' || userEmail=='') {
      alert('Please fill in all available fields before submitting');
      return;
    }

    const newUser = {
      userName: userName,
      password: userPassword,
      firstName: firstName,
      lastName: lastName,
      email: userEmail,
      isAdmin: isAdmin,
      status: userStatus
    }

    const response = await editUser(token, userId, newUser)
    console.log('response', response)
    alert(`${newUser.userName} has been edited.`);
    setUser(response);
  };

  const handleAdminChange = async (e) => {
    setIsAdmin(!isAdmin);
    setIsChecked(!isChecked);
  }

return (
  <div className='self-form-container'>
    <form className='self-form' onSubmit={submitListener}>
    <div className='self-header'>
          <h2>Edit Your Account</h2>
      </div>
      <div className='self-form-edit'>
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
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>
      <button className='edit-self-button' type='submit'>Save Changes</button>
    </form>
  </div>
)

};

export default EditAccount;