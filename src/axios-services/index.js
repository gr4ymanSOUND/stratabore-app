import axios from 'axios';

import * as Syntax from './syntaxUtil.js'

if (process.env.NODE_ENV === 'production') {
  axios.defaults.baseURL = process.env.REACT_APP_BASE_URL;
} else {
  axios.defaults.baseURL = 'http://localhost:4000';
}
// axios.defaults.baseURL = 'http://localhost:4000';

// user calls


export async function loginUser(userName, password) {

  console.log('loginUser called', userName, password);
  try {
    const { data } = await axios.post(`/boringdbapi/users/login`,
      {
        username: userName,
        password: password
      }
    )
    console.log('login return data', data);
    const dataSyntaxChange = Syntax.userSyntaxFrontEnd(data.user);
    const loggedInData = {
      ...data,
      user: dataSyntaxChange
    };
    return loggedInData;
  } catch (error) {
    console.error('Error during login:', error);
    throw (error);
  }
}

export async function getMe(token) {
  try {
    const auth = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
    const { data } = await axios.get(`/boringdbapi/users/me`, auth);
    const dataSyntaxChange = Syntax.userSyntaxFrontEnd(data);
    return dataSyntaxChange;
  } catch (error) {
    console.error(error)
  }
}

export async function getAllUsers(token) {
  try {
    const auth = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
    const { data } = await axios.get(`/boringdbapi/users/`, auth);
    const userListSyntaxFix = data.map((user) => {
      return Syntax.userSyntaxFrontEnd(user);
    });
    return userListSyntaxFix;
  } catch (error) {
    console.error(error)
  }
}

export async function createUser(token, newUserData) {
  try {
    const auth = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
    const backEndUserData = Syntax.userSyntaxBackEnd(newUserData);
    delete backEndUserData.id;
    backEndUserData.password = newUserData.password;
    const payload = {
      newUserData: backEndUserData
    }
    const { data } = await axios.post(`/boringdbapi/users/create`, payload, auth);
    console.log('new user data after creation', data);
    const frontEndUserData = Syntax.userSyntaxFrontEnd(data);
    return frontEndUserData;
  } catch (error) {
    console.error(error)
  }
}

export async function editUser(token, userId, newUserData) {
  try {
    const auth = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
    const backEndUserData = Syntax.userSyntaxBackEnd(newUserData);
    delete backEndUserData.id;
    backEndUserData.password = newUserData.password;
    const payload = {
      newUserData: backEndUserData
    }
    const { data } = await axios.patch(`/boringdbapi/users/${userId}`, payload, auth);
    if (typeof data !== 'string') {
    const frontEndUserData = Syntax.userSyntaxFrontEnd(data);
    return frontEndUserData;
    } else {
      return data;
    }
  } catch (error) {
    console.error(error)
  }
}

export async function removeUser(token, userId) {
  try {
    const auth = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
    const { data } = await axios.delete(`/boringdbapi/users/${userId}`, auth);
    const frontEndUserData = Syntax.userSyntaxFrontEnd(data);
    return frontEndUserData;
  } catch (error) {
    console.error(error);
  }
}

// job calls

export async function getAllJobs(token) {
  try {
    const auth = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
    const { data } = await axios.get(`/boringdbapi/jobs`, auth);
    const frontEndJobList = data.map((backEndJob) => {
      return Syntax.jobSyntaxFrontEnd(user);
    });
    return frontEndJobList;
  } catch (error) {
    console.error(error);
  }
}

export async function addJob(token, newJob) {
  try {
    const auth = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
    const backEndJob = Syntax.jobSyntaxBackEnd(newJob);
    const payload = {
      newJob: backEndJob
    }
    const { data } = await axios.post(`/boringdbapi/jobs/create`, payload, auth);
    const frontEndJob = Syntax.jobSyntaxFrontEnd(data);
    return frontEndJob;  
  } catch (error) {
    console.error(error);
  }
}

export async function cancelJob(token, jobId) {
  try {
    const auth = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
    const { data } = await axios.delete(`/boringdbapi/jobs/${jobId}`, auth);
    const frontEndJob = Syntax.jobSyntaxFrontEnd(data);
    return frontEndJob;
  } catch (error) {
    console.error(error);
  }
}

export async function editJob(token, jobId, newJobData) {
  try {
    const auth = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
    const backEndJob = Syntax.jobSyntaxBackEnd(newJobData);
    const payload = {
      newJob: backEndJob
    }
    const { data } = await axios.patch(`/boringdbapi/jobs/${jobId}`, payload, auth);
    const frontEndJob = Syntax.jobSyntaxFrontEnd(data);
    return frontEndJob; 
  } catch (error) {
    console.error(error);
  }
}

// rig calls

export async function getAllRigs(token) {
  try {
    const auth = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
    const { data } = await axios.get(`/boringdbapi/rigs`, auth);
    const frontEndRigList = data.map((rig) => {
      return Syntax.rigSyntaxFrontEnd(rig);
    });
    return frontEndRigList;
  } catch (error) {
    console.error(error);
  }
}

export async function editRig(token, rigId, newRigData) {
  try {
    const auth = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
    const backEndRig = Syntax.rigSyntaxBackEnd(newRigData);
    const payload = {
      newRigData: backEndRig
    }
    const { data } = await axios.patch(`/boringdbapi/rigs/${rigId}`, payload, auth);
    const frontEndRig = Syntax.rigSyntaxBackEnd(data);
    return frontEndRig;
  } catch (error) {
    console.error(error)
  }
}

export async function removeRig(token, rigId) {
  try {
    const auth = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
    const { data } = await axios.delete(`/boringdbapi/rigs/${rigId}`, auth);
    const frontEndRig = Syntax.rigSyntaxBackEnd(data);
    return frontEndRig;
  } catch (error) {
    console.error(error);
  }
}

export async function createRig(token, newRigData) {
  try {
    const auth = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
    const backEndRig = Syntax.rigSyntaxBackEnd(newRigData);
    const payload = {
      newRigData: backEndRig
    }
    const { data } = await axios.post(`/boringdbapi/rigs/create`, payload, auth);
    const frontEndRig = Syntax.rigSyntaxBackEnd(data);
    return frontEndRig;
  } catch (error) {
    console.error(error);
  }
}

// job_rig (job assignment) calls

export async function getAssignedAndUnassignedJobs(token) {
  try {
    const auth = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
    const { data } = await axios.get(`/boringdbapi/assignments/all`, auth);
    const frontEndAssignments = data.map((assignment) => {
      return Syntax.assignmentSyntaxFrontEnd(assignment);
    });
    return frontEndAssignments;
  } catch (error) {
    console.error(error);
  }
}

export async function getAssignedJobs(token) {
  try {
    const auth = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
    const { data } = await axios.get(`/boringdbapi/assignments/assigned`, auth);
    const frontEndAssignments = data.map((assignment) => {
      return Syntax.assignmentSyntaxFrontEnd(assignment);
    });
    return frontEndAssignments;
  } catch (error) {
    console.error(error);
  }
}

export async function createJobRig(token, newJobRig) {
  try {
    const auth = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
    const backEndAssignment = Syntax.assignmentSyntaxBackEnd(newJobRig);
    const payload = {
      newJobRig: backEndAssignment
    }
    const { data } = await axios.post(`/boringdbapi/assignments/assign`, payload, auth);
    const frontEndAssignment = Syntax.assignmentSyntaxFrontEnd(data);
    return frontEndAssignment;
  } catch (error) {
    console.error(error);
  }
}

export async function updateJobRig(token, newJobRig) {
  try {
    const auth = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
    const backEndAssignment = Syntax.assignmentSyntaxBackEnd(newJobRig);
    const payload = {
      newJobRig: backEndAssignment
    }
    const { data } = await axios.patch(`/boringdbapi/assignments/update`, payload, auth);
    const frontEndAssignment = Syntax.assignmentSyntaxFrontEnd(data);
    return frontEndAssignment;
  } catch (error) {
    console.error(error);
  }
}

export async function deleteJobRig(token, jobToUnassign) {
  try {
    const backEndAssignment = Syntax.assignmentSyntaxBackEnd(jobToUnassign);
    // delete axios calls have to send the payload and auth differently, found this answer on stackoverflow
    const { data } = await axios.delete(`/boringdbapi/assignments/unassign`, {
      headers: {
        'Authorization': `Bearer ${token}`
      },
      data: {
        'jobToUnassign': backEndAssignment
      }
    });
    console.log('delete assignment axios return data', data);
    return data;
  } catch (error) {
    console.error(error);
  }
}