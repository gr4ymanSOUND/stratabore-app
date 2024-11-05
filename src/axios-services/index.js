import axios from 'axios';

import * as Syntax from './syntaxUtil.js'

// if (process.env.NODE_ENV === 'production') {
//   axios.defaults.baseURL = process.env.REACT_APP_BASE_URL;
// } else {
//   axios.defaults.baseURL = 'http://localhost:4000';
// }
axios.defaults.baseURL = 'http://localhost:4000';


// user calls

export async function loginUser(userName, password) {

  try {
    const { data } = await axios.post(`/boringApi/users/login`,
      {
        username: userName,
        password: password
      }
    )

    const dataSyntaxChange = Syntax.userSyntaxFrontEnd(data.user);

    const loggedInData = {
      ...data,
      user: dataSyntaxChange
    };
    // console.log('data from axios call after syntax change', loggedInData)
    return loggedInData;
  } catch (error) {
    console.error(error)
  }
}

export async function getMe(token) {
  try {
    const auth = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
    const { data } = await axios.get(`/boringApi/users/me`, auth);
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
    const { data } = await axios.get(`/boringApi/users/`, auth);
    const userListBoolFix = data.map((user) => {
      return Syntax.userSyntaxFrontEnd(user);
    });
    return userListBoolFix;
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
    const backEndUserData = userSyntaxBackEnd(newUserData);
    delete backEndUserData.id;
    backEndUserData.password = newUserData.password;
    const payload = {
      newUserData: backEndUserData
    }
    const { data } = await axios.post(`/boringApi/users/create`, payload, auth);
    return data;
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
    const backEndUserData = userSyntaxBackEnd(newUserData);
    delete backEndUserData.id;
    backEndUserData.password = newUserData.password;
    const payload = {
      newUserData: backEndUserData
    }
    const { data } = await axios.patch(`/boringApi/users/${userId}`, payload, auth);
    return data;
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
    const { data } = await axios.delete(`/boringApi/users/${userId}`, auth);
    return data;
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
    const { data } = await axios.get(`/boringApi/jobs`, auth);
    return data;
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
    const payload = {
      newJob: newJob
    }
    const { data } = await axios.post(`/boringApi/jobs/create`, payload, auth);
    return data;
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
    const { data } = await axios.delete(`/boringApi/jobs/${jobId}`, auth);
    return data;
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
    const payload = {
      newJobData: newJobData
    }
    const { data } = await axios.patch(`/boringApi/jobs/${jobId}`, payload, auth);
    return data;
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
    const { data } = await axios.get(`/boringApi/rigs`, auth);
    return data;
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
    const payload = {
      newRigData: newRigData
    }
    const { data } = await axios.patch(`/boringApi/rigs/${rigId}`, payload, auth);
    return data;
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
    const { data } = await axios.delete(`/boringApi/rigs/${rigId}`, auth);
    return data;
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
    const payload = {
      newRigData: newRigData
    }
    const { data } = await axios.post(`/boringApi/rigs/create`, payload, auth);
    return data;
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
    const { data } = await axios.get(`/boringApi/assignments/all`, auth);
    return data;
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
    const { data } = await axios.get(`/boringApi/assignments/assigned`, auth);
    return data;
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
    const payload = {
      newJobRig: newJobRig
    }
    const { data } = await axios.post(`/boringApi/assignments/assign`, payload, auth);
    return data;
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
    const payload = {
      newJobRig: newJobRig
    }
    const { data } = await axios.patch(`/boringApi/assignments/update`, payload, auth);
    return data;
  } catch (error) {
    console.error(error);
  }
}

export async function deleteJobRig(token, jobToUnassign) {
  try {
    // delete axios calls have to send the payload and auth differently, found this answer on stackoverflow
    const { data } = await axios.delete(`/boringApi/assignments/unassign`, {
      headers: {
        'Authorization': `Bearer ${token}`
      },
      data: {
        'jobToUnassign': jobToUnassign
      }
    });
    return data;
  } catch (error) {
    console.error(error);
  }
}