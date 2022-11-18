import React, { useState } from 'react';
import { loginUser } from "../axios-services";


const Login = ({ setToken }) => {

    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");

    const submitHandler = async (e) =>{
        e.preventDefault()

        if (!userName || !password) {
          alert('Please enter a username and/or password!')
          return;
        }

        // const response = await loginUser(userName, password);
        // setToken(response.token);
        // localStorage.setItem("userToken", response.token);

        setUserName("");
        setPassword("");
    }


    return (
        <>
            <form className='account-form' onSubmit={submitHandler}>
                <h2>Please Log In</h2>
                <div className="form-section">
                <label className="form-label">Username:</label>
                <input
                    type="text"
                    minLength={'6'}
                    value={userName}
                    onChange={({target: {value}}) => setUserName(value)}
                    className="form-control"
                    id="user"
                    placeholder="Your User Name Here"
                />
                </div>
                <div className="form-section">
                <label className="form-label">Password:</label>
                <input
                    type="password"
                    minLength={'6'}
                    value={password}
                    onChange={({target: {value}}) => setPassword(value)}
                    className="form-control"
                    id="pass"
                    placeholder="********"
                />
                </div>
                <button className="userform-button" type='submit'>Login</button>
            </form>
        </>
    )
}

export default Login;