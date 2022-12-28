import axios from 'axios';
axios.defaults.baseURL = 'http://localhost:4000';

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

export async function deleteJob(token, jobId) {
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





