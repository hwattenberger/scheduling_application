import axios from "axios";
import { useState } from "react";
import Register from "./Register"


async function loginUser(credentials) {
    return await axios.post('http://localhost:5000/auth/login', {
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(credentials)
    })
        .then(data => console.log("YESYES", data)) //data.data.token)
        .catch(e => console.log("ERRR", e))
}

async function loginUser2(credentials) {
    return await axios.post('http://localhost:5000/auth/login', credentials)
        .then(data => console.log("YESYES", data)) //data.data.token)
        .catch(e => console.log("ERRR", e))
}

const Login = ({setLoginUser}) => {
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();

    const handleSubmit = (async (event) => {
        event.preventDefault();
        const loginPerson = await loginUser({
            email,
            password
        })
        setLoginUser(loginPerson);
    })

    const googleLogin = () => {
        window.open("http://localhost:5000/auth/google", "_self");
    }

    return (
        <div id="loginPage">
            <div>
                <h2>Login:</h2>
                <div onClick={googleLogin}>Sign in with Google</div>
                <span>-or Sign in with Email</span>
                <form onSubmit={handleSubmit}>
                    <label>
                        Email:
                        <input type="text" name="email" onChange={e => setEmail(e.target.value)}/>
                    </label>
                    <label>
                        Password:
                        <input type="password" name="password" onChange={e => setPassword(e.target.value)}/>
                    </label>
                    <input type="submit" value="Login" />
                </form>
            </div>

            Not registered yet?  Create an Account
            <Register setLoginUser={setLoginUser}/>
        </div>
    );
}

export default Login;