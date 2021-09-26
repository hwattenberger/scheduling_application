import React, { useContext } from "react";
import axios from "axios";
import { LoginUserStateContext } from '../../Context/userAuth/Context'
import {Link} from 'react-router-dom'


import Button from '@material-ui/core/Button'
import './Navbar.css';

const NavBar = () => {
    const {loginUserInfo, dispatch} = useContext(LoginUserStateContext);
    const userDetails = loginUserInfo.userDetails;
    // console.log("Nav user", userObject)

    function logout() {
        axios.get('http://localhost:5000/auth/logout', {withCredentials: true})
            .then(data =>  {
                dispatch({type: 'LOGOUT'});
                window.location.reload(true);
            })
            .catch(e => console.log("Error Logging Out", e))
    }

    return (
        <div id="navbar">
            <div id="navbar-logo">
                <Link to="/">MySchedule</Link>
            </div>
            <NavBarLinks userDetails={userDetails}/>
            <div id="navbar-login">
                {!userDetails && <Link to="/login"><Button variant="outlined">Login</Button></Link>}
                {!userDetails && <Link to="/register"><Button variant="outlined">Create Account</Button></Link>}
                {userDetails && <Button variant="outlined" onClick={logout}>Logout</Button>}
            </div>
        </div>
    )
}


const NavBarLinks = ({userDetails}) => {
    // const userObject = useContext(myContext);
    // console.log("Nav user", userObject)

    if(!userDetails) return null;

    if(userDetails.isAdmin) return (
        <div id="navbar-links">
            <div><Link to="/schedule">Schedule</Link></div>
            <div><Link to="/generalSetup">Settings</Link></div>
            <div><Link to="/staff">Staff</Link></div>
        </div>
    )

    return (
        <div id="navbar-links">
            <div><Link to={`/staff/${userDetails.id}/schedule`}>My Schedule</Link></div>
            <div><Link to={`/staff/${userDetails.id}`}>Settings</Link></div>
        </div>
    )
}


export default NavBar;