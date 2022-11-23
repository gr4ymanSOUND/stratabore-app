import React, { useState } from 'react';
import { loginUser } from "../axios-services";

const Login = ({ setToken, setUser}) => {

    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");

    const submitHandler = async (e) =>{
        e.preventDefault()

        if (!userName || !password) {
          alert('Please enter a username and/or password!')
          return;
        }

        const response = await loginUser(userName, password);
        setToken(response.token);
        setUser(response.user);
        localStorage.setItem("userToken", response.token);
        console.log(response.message, response.user);

        setUserName("");
        setPassword("");
    }


    return (
        <>
            <form className='login-form' onSubmit={submitHandler}>
                <div className='login-header'>
                    <h2>Please Log In</h2>
                </div>
                <div className='login-body'>
                    <div className="input-section">
                        <label className="input-label">Username:</label>
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
                    <div className="input-section">
                        <label className="input-label">Password:</label>
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
                    <button className="login-button" type='submit'>Login</button>
                </div>
            </form>
        </>
    )
}

export default Login;