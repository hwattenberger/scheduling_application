import {useParams} from "react-router-dom";
import axios from "axios";
import React, { useState, useEffect } from "react";
import StaffWeeklyAvailability from "./StaffWeeklyAvailability";
import StaffRequestOff from "./StaffRequestOff";

import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'

import './StaffWeeklyAvailability.css';

const noUser = {
    email: "",
    firstName: "",
    lastName: ""
}

const StaffMember = (props) => {
    const [user, setUser] = useState(noUser);
    const { staffId } = useParams();
    const [userSchedule, setUserSchedule] = useState({});
    const [shifts, setShifts] = useState([]);

    useEffect(() => {
        getUserInfoAndShifts();
        // getShifts();
    }, []);

    function getUserInfoAndShifts() {
        axios.get(`http://localhost:5000/staff/${staffId}`, {withCredentials: true})
            .then(data => { 
                const tempUser = {
                    ...data.data,
                    email: data.data.email || "",
                    firstName: data.data.firstName || "",
                    lastName: data.data.lastName || ""
                }
                setUser(tempUser)
                console.log("Success temp user", user)
                getShifts(tempUser.userRole);
            })
            .catch(e => console.log("Error Staff", e))
    }

    function getShifts(userRole) {
        axios.get('http://localhost:5000/shifts', {
            withCredentials: true,
            params: {role: userRole._id}
        })
            .then(data => setShifts(data.data))
            .catch(e => console.log("Error Roles", e))
    }

    const handleInputChange = (e) => {
        setUser({ ...user,[e.target.name]:e.target.value });
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        axios.put(`http://localhost:5000/staff/${staffId}`, {
            withCredentials: true,
            body: user
        })
            .then(data => console.log("Success!", data.data))
            .catch(e => console.log("Error Staff", e))
    }

    if(!user) return (<h2>Loading</h2>);

    return (
        <div id="staffMemberInfoPage">
            <h2>Staff Member Setup</h2>
            {/* {JSON.stringify(shifts)} */}
            <form onSubmit={handleSubmit}>
                <div>
                    <TextField name="email" label="Email" value={user.email} onChange={handleInputChange} />
                </div>
                <div>
                    <TextField name="firstName" label="First Name" value={user.firstName} onChange={handleInputChange} />
                </div>
                <div>
                    <TextField name="lastName" label="Last Name" value={user.lastName} onChange={handleInputChange} />
                </div>
                {/* <label>
                    Email:
                    <input type="text" name="email" value={user.email} onChange={handleInputChange}/>
                </label>
                <label>
                    First Name:
                    <input type="test" name="firstName" value={user.firstName} onChange={handleInputChange}/>
                </label>
                <label>
                    Last Name:
                    <input type="test" name="lastName" value={user.lastName} onChange={handleInputChange}/>
                </label> */}
                <Button variant="outlined" type="submit">Update</Button>
            </form>
            {shifts && <StaffWeeklyAvailability shifts={shifts}/>}
            <StaffRequestOff />
        </div>
        );
}

export default StaffMember;