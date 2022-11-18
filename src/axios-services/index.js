import axios from 'axios';

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
