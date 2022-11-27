import axios from 'axios';
axios.defaults.baseURL = 'http://localhost:4000';

export async function loginUser(userName, password){

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
      
    } catch (error) {
        console.error(error);
    }
}
