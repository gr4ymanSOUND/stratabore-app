import axios from 'axios';
axios.defaults.baseURL = 'http://localhost:4000';

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

