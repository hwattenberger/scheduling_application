import React, { useContext } from "react";
import axios from "axios";
import { myContext } from '../../Context'

import Button from '@material-ui/core/Button'
import './Navbar.css';

const NavBar = ({userObject}) => {
    // const userObject = useContext(myContext);
    // console.log("Nav user", userObject)

    function logout() {
        axios.get('http://localhost:5000/auth/logout', {withCredentials: true})
            .then(data =>  {
                window.location.reload(true);
            })
            .catch(e => console.log("Error Logging Out", e))
    }

    return (
        <div id="navbar">
            <div id="navbar-logo">
                <a href="/">MySchedule</a>
            </div>
            <NavBarLinks userObject={userObject}/>
            <div id="navbar-login">
                {!userObject && <a href="/login"><Button variant="outlined">Login</Button></a>}
                {!userObject && <a href="/register"><Button variant="outlined">Create Account</Button></a>}
                {userObject && <Button variant="outlined" onClick={logout}>Logout</Button>}
            </div>
        </div>
    )
}


const NavBarLinks = ({userObject}) => {
    // const userObject = useContext(myContext);
    // console.log("Nav user", userObject)

    if(!userObject) return null;

    if(userObject.isAdmin) return (
        <div id="navbar-links">
            <div><a href="/schedule">Schedule</a></div>
            <div><a href="/generalSetup">Settings</a></div>
            <div><a href="/staff">Staff</a></div>
        </div>
    )

    return (
        <div id="navbar-links">
            <div><a href={`/staff/${userObject._id}/schedule`}>My Schedule</a></div>
            <div><a href={`/staff/${userObject._id}`}>Settings</a></div>
        </div>
    )
}


export default NavBar;