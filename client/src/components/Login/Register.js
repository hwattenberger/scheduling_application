import axios from "axios";
import { useState } from "react";
import { Button, TextField } from '@material-ui/core'
import './LoginRegister.css'

async function registerUser2(credentials) {
    return await axios.post('http://localhost:5000/auth/register', {
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(credentials)
    })
        .then(data => console.log("YESYES", data)) //data.data.token)
        .catch(e => console.log("ERRR", e))
}

async function registerUser(credentials) {
    return await axios.post('http://localhost:5000/auth/register', credentials)
        .then(data => console.log("YESYES", data)) //data.data.token)
        .catch(e => console.log("ERRR", e))
}

const Register = ({setLoginUser}) => {
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();

    const handleSubmit = (async (event) => {
        event.preventDefault();
        console.log("Register here", email, password)
        const registerPerson = await registerUser({
            email,
            password
        })
        setLoginUser(registerPerson);
    })

    const googleRegister = () => {
        window.open("http://localhost:5000/auth/google", "_self");
    }

    return (
        <div id="registerPage">
            <div id="registerDiv">
                <div id="registerDiv-Header">
                    <h2>Register</h2>
                    <div>
                        <Button variant="outlined" onClick={googleRegister}>Register with Google</Button>
                    </div>
                    -or- Register with Email
                </div>
                <form onSubmit={handleSubmit}>
                    <div>
                        <TextField name="email" label="Email" value={email} onChange={e => setEmail(e.target.value)} />
                    </div>
                    <div>
                        <TextField name="password" label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
                    </div>
                    <Button variant="outlined" type="submit">Register</Button>
                </form>
            </div>

        </div>
    );
}

export default Register;

// Inspiration: https://dribbble.com/shots/15392711-Dashboard-Login-Sign-Up