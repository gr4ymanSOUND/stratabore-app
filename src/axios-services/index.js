import axios from 'axios';

if (process.env.NODE_ENV === 'production') {
  axios.defaults.baseURL = process.env.REACT_APP_BASE_URL;
} else {
  axios.defaults.baseURL = 'http://localhost:4000';
}

// user calls

export async function loginUser(userName, password) {
  try {
    const { data } = await axios.post(`/api/users/login`,
      {
        userName: userName,
        password: password
      }
    )
    return data;
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
    const { data } = await axios.get(`/api/users/me`, auth);
    return data;
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
    const { data } = await axios.get(`/api/users/`, auth);
    return data;
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
    const payload = {
      newUserData: newUserData
    }
    const { data } = await axios.post(`/api/users/create`, payload, auth);
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
    const payload = {
      newUserData: newUserData
    }
    const { data } = await axios.patch(`/api/users/${userId}`, payload, auth);
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
    const { data } = await axios.delete(`/api/users/${userId}`, auth);
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
    const { data } = await axios.get(`/api/jobs`, auth);
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
    const { data } = await axios.post(`/api/jobs`, payload, auth);
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
    const { data } = await axios.delete(`/api/jobs/${jobId}`, auth);
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
    const { data } = await axios.patch(`/api/jobs/${jobId}`, payload, auth);
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
    const { data } = await axios.get(`/api/rigs`, auth);
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
    const { data } = await axios.patch(`/api/rigs/${rigId}`, payload, auth);
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
    const { data } = await axios.delete(`/api/rigs/${rigId}`, auth);
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
    const { data } = await axios.post(`/api/rigs/create`, payload, auth);
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
    const { data } = await axios.get(`api/job_rigs/all`, auth);
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
    const { data } = await axios.get(`api/job_rigs/assigned`, auth);
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
    const { data } = await axios.post(`api/job_rigs`, payload, auth);
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
    const { data } = await axios.patch(`api/job_rigs`, payload, auth);
    return data;
  } catch (error) {
    console.error(error);
  }
}

export async function deleteJobRig(token, jobToUnassign) {
  try {
    // delete axios calls have to send the payload and auth differently, found this answer on stackoverflow
    const { data } = await axios.delete(`api/job_rigs/`, {
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