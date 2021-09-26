import axios from "axios";
import React, { useState, useContext } from "react";
import { Button, TextField } from '@material-ui/core'
import { LoginUserStateContext } from '../../Context/userAuth/Context'
import googleImg from '../../images/google-logo.png'
import './LoginRegister.css'


const Login = (props) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const {loginUserInfo, dispatch} = useContext(LoginUserStateContext);
    const {errorMessage} = loginUserInfo;
    const baseURL = process.env.REACT_APP_API_BASE_URL;

    const handleSubmit = (async (event) => {
        event.preventDefault();
        await loginUser({
            email,
            password
        })
    })

    async function loginUser(loginPayload) {
        dispatch({type: 'REQUEST_LOGIN'});
        return await axios.post(`${baseURL}/auth/login`, JSON.stringify(loginPayload),{
            headers: {'Content-Type': 'application/json'}, withCredentials: true
        })
            .then(data => {
                dispatch({type: 'LOGIN_SUCCESS', payload: {
                    isAdmin: data.data.isAdmin,
                    id: data.data._id
                }});
                window.location.href = "/";
            })
            .catch(e => {
                if (e.response.data && e.response.data.message) dispatch({ type: 'LOGIN_ERROR', error: e.response.data.message })
                else dispatch({ type: 'LOGIN_ERROR', error: "Incorrect username or password" })
            })
    }

    const getError = () => {
        if (errorMessage) return (
            <div id="errorDiv">
                {errorMessage}
            </div>
            );
        return null;
    }

    const googleLogin = () => {
        window.open(`${baseURL}/auth/google`, "_self");
    }

    return (
        <div id="loginPage">
            <div id="loginDiv">
                <div id="loginDiv-Header">
                    <h2>Login</h2>
                    <div>
                        <Button variant="outlined" onClick={googleLogin}><img className="googleImg" alt="Google Login" src={googleImg} />Sign in with Google</Button>
                    </div>
                    -or- Sign in with Email
                </div>
                {getError()}
                <form onSubmit={handleSubmit}>
                    <div>
                        <TextField name="email" label="Email" value={email} onChange={e => setEmail(e.target.value)} />
                    </div>
                    <div>
                        <TextField name="password" label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
                    </div>
                    <Button variant="outlined" type="submit">Login</Button>
                </form>
            Not registered yet?  <a href="/register">Create an Account</a>
            </div>

        </div>
    );
}

export default Login;