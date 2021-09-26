import axios from "axios";
import { useState } from "react";
import { Button, TextField } from '@material-ui/core'
import googleImg from '../../images/google-logo.png'
import './LoginRegister.css'

const Register = (props) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [emailHelper, setEmailHelper] = useState("");
    const [passwordHelper, setPasswordHelper] = useState("");

    const handleSubmit = (async (event) => {
        event.preventDefault();

        setEmailHelper("");
        setPasswordHelper("");
        setError("");

        const error = validateEmailPassword();
        
        if (error) return;

        await registerUser({
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

    const validateEmailPassword = () => {
        let isError = false;

        if(/[^@]/.test(email)) {
            setEmailHelper("Please enter a valid email address");
            isError = true;
        }

        if(!email) {
            setEmailHelper("Please enter email address");
            isError = true;
        }
        if (!password) {
            setPasswordHelper("Please enter password");
            isError = true;
        }

        return isError;
    }

    const getError = () => {
        if (error) return (
            <div id="errorDiv">
                {error}
            </div>
            );
        return null;
    }

    const emailCollection = () => {
        if (!emailHelper) return <TextField name="email" label="Email" value={email} onChange={e => setEmail(e.target.value)} />;
        return <TextField error helperText={emailHelper} name="email" label="Email" value={email} onChange={e => setEmail(e.target.value)} />;
    }

    const passwordCollection = () => {
        if (!passwordHelper) return <TextField name="password" label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />;
        return <TextField error helperText={passwordHelper} name="password" label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />;
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
                        <Button variant="outlined" onClick={googleRegister}><img className="googleImg" alt="Google Login" src={googleImg} />Register with Google</Button>
                    </div>
                    -or- Register with Email
                </div>
                {getError()}
                <form onSubmit={handleSubmit}>
                    <div>
                        {emailCollection()}
                    </div>
                    <div>
                        {passwordCollection()}
                    </div>
                    <Button variant="outlined" type="submit">Register</Button>
                </form>
            </div>

        </div>
    );
}

export default Register;

// Inspiration: https://dribbble.com/shots/15392711-Dashboard-Login-Sign-Up