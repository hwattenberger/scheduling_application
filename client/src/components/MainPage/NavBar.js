import React, { useContext, useState } from "react";
import axios from "axios";
import { LoginUserStateContext } from '../../Context/userAuth/Context'
import {Link} from 'react-router-dom'


import Button from '@material-ui/core/Button'
import './Navbar.css';

const NavBar = () => {
    const [showLink, setshowLinks] = useState(false);
    const {loginUserInfo, dispatch} = useContext(LoginUserStateContext);
    const userDetails = loginUserInfo.userDetails;
    const baseURL = process.env.REACT_APP_API_BASE_URL;

    function logout() {
        axios.get(`${baseURL}/auth/logout`, {withCredentials: true})
            .then(data =>  {
                dispatch({type: 'LOGOUT'});
                window.location.reload(true);
            })
            .catch(e => console.log("Error Logging Out", e))
    }

    function setShow() {
        setshowLinks(!showLink);
    }

    function linkClassName() {
        if (!showLink) return "hideDiv";
        return "showDiv"
    }

    return (
        <div id="navbar">
            <div id="navbar-logo">
                <Link to="/">MySchedule</Link>
            </div>
            <div className="nav-ham" onClick={setShow}>
                <div></div>
                <div></div>
                <div></div>
            </div>
            <NavBarLinks userDetails={userDetails} showLink={showLink}/>
            <div id="navbar-login" className={linkClassName()}>
                {!userDetails && <Link to="/login"><Button variant="outlined">Login</Button></Link>}
                {!userDetails && <Link to="/register"><Button variant="outlined">Create Account</Button></Link>}
                {userDetails && <Button variant="outlined" onClick={logout}>Logout</Button>}
            </div>
        </div>
    )
}


const NavBarLinks = ({userDetails, showLink}) => {

    function linkClassName() {
        if (!showLink) return "hideDiv";
        return "showDiv"
    }

    if(!userDetails) return null;

    if(userDetails.isAdmin) return (
        <div id="navbar-links" className={linkClassName()}>
            <div><Link to="/schedule">Schedule</Link></div>
            <div><Link to="/generalSetup">Settings</Link></div>
            <div><Link to="/staff">Staff</Link></div>
            <div><Link to={`/staff/${userDetails.id}/schedule`}>My Shifts</Link></div>
        </div>
    )

    return (
        <div id="navbar-links" className={linkClassName()}>
            <div><Link to={`/staff/${userDetails.id}/schedule`}>My Shifts</Link></div>
            <div><Link to={`/staff/${userDetails.id}`}>Settings</Link></div>
        </div>
    )
}


export default NavBar;