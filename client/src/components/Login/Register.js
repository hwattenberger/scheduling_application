import axios from "axios";
import { useState } from "react";
import { Button, TextField } from '@material-ui/core'
import './LoginRegister.css'

const Register = (props) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = (async (event) => {
        event.preventDefault();
        const registerPerson = await registerUser({
            email,
            password
        })
    })

    async function registerUser(credentials) {
        return await axios.post('http://localhost:5000/auth/register', credentials, {withCredentials: true})
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
                {getError()}
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