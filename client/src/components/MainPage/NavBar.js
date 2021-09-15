import React, { useContext } from "react";
import axios from "axios";
import { myContext } from '../../Context'

import Button from '@material-ui/core/Button'
import './Navbar.css';

const NavBar = () => {
    const userObject = useContext(myContext);
    console.log("Nav user", userObject)

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
            <NavBarLinks />
            <div id="navbar-login">
                {!userObject && <a href="/login"><Button variant="outlined">Login</Button></a>}
                {!userObject && <a href="/register"><Button variant="outlined">Create Account</Button></a>}
                {userObject && <Button variant="outlined" onClick={logout}>Logout</Button>}
            </div>
        </div>
    )
}


const NavBarLinks = (props) => {
    const userObject = useContext(myContext);
    console.log("Nav user", userObject)

    if(!userObject) return null;

    if(userObject.isAdmin) return (
        <div id="navbar-links">
            <div><a href="/schedule">Schedule</a></div>
            <div><a href="/generalSetup">Settings</a></div>
            <div><a href="/staff">Staff</a></div>
            {/* <div><a href="/staff">Shifts</a></div> */}
        </div>
    )

    return (
        <div id="navbar-links">
            <div>Settings</div>
            <div>My Schedule</div>
        </div>
    )
}


export default NavBar;