import axios from "axios";
import { useState } from "react";

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

    return (
        <div id="Register">
            <h2>Sign Up</h2>
            <div>Sign up with Google</div>
            <span>-or Sign up with Email</span>
            <div>
                <form onSubmit={handleSubmit}>
                    <label>
                        Email:
                        <input type="text" name="email" onChange={e => setEmail(e.target.value)}/>
                    </label>
                    <label>
                        Password:
                        <input type="password" name="password" onChange={e => setPassword(e.target.value)}/>
                    </label>
                    <input type="submit" value="Register" />
                </form>
            </div>
        </div>
    );
}

export default Register;

// Inspiration: https://dribbble.com/shots/15392711-Dashboard-Login-Sign-Up