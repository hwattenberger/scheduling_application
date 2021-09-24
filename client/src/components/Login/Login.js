import axios from "axios";
import { useState } from "react";
import { Button, TextField } from '@material-ui/core'
import googleImg from '../../images/google-logo.png'
import './LoginRegister.css'


const Login = (props) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = (async (event) => {
        event.preventDefault();
        const loginPerson = await loginUser({
            email,
            password
        })
    })

    async function loginUser(credentials) {
        return await axios.post('http://localhost:5000/auth/login', JSON.stringify(credentials),{
            headers: {'Content-Type': 'application/json'}, withCredentials: true
        })
            .then(data => window.open("/", "_self"))
            .catch(e => {
                if (e.response.data && e.response.data.message) setError(e.response.data.message)
                else setError("Incorrect username or password")
            })
    }

    const getError = () => {
        if (error) return (
            <div id="errorDiv">
                {error}
            </div>
            );
        return null;
    }

    const googleLogin = () => {
        window.open("http://localhost:5000/auth/google", "_self");
    }

    return (
        <div id="loginPage">
            <div id="loginDiv">
                <div id="loginDiv-Header">
                    <h2>Login</h2>
                    <div>
                        <Button variant="outlined" onClick={googleLogin}><img className="googleImg" src={googleImg} />Sign in with Google</Button>
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