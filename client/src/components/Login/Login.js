import axios from "axios";
import { useState } from "react";
import { Button, TextField } from '@material-ui/core'
import './LoginRegister.css'


async function loginUser(credentials) {
    return await axios.post('http://localhost:5000/auth/login', JSON.stringify(credentials),{
        headers: {'Content-Type': 'application/json'}, withCredentials: true
    })
        .then(data => window.open("/", "_self"))
        .catch(e => console.log("ERRR", e))
}

const Login = (props) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = (async (event) => {
        event.preventDefault();
        const loginPerson = await loginUser({
            email,
            password
        })
    })

    const googleLogin = () => {
        window.open("http://localhost:5000/auth/google", "_self");
    }

    return (
        <div id="loginPage">
            <div id="loginDiv">
                <div id="loginDiv-Header">
                    <h2>Login</h2>
                    <div>
                        <Button variant="outlined" onClick={googleLogin}>Sign in with Google</Button>
                    </div>
                    -or- Sign in with Email
                </div>
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