import {useParams} from "react-router-dom";
import axios from "axios";
import React, { useState, useEffect } from "react";
import StaffWeeklyAvailability from "./StaffWeeklyAvailability";
import StaffRequestOff from "./StaffRequestOff";
import UserAvatar from "../General/UserAvatar"

import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import PhotoCamera from '@material-ui/icons/PhotoCamera';


import './StaffWeeklyAvailability.css';

const noUser = {
    email: "",
    firstName: "",
    lastName: "",
    profilePhoto: ""
}

const StaffMember = () => {
    const [user, setUser] = useState(noUser);
    const { staffId } = useParams();
    const [shifts, setShifts] = useState([]);
    const [newPhoto, setNewPhoto] = useState("");

    useEffect(() => {
        getUserInfoAndShifts();
    }, []);

    function getUserInfoAndShifts() {
        axios.get(`http://localhost:5000/staff/${staffId}`, {withCredentials: true})
            .then(data => { 
                const tempUser = {
                    ...data.data,
                    email: data.data.email || "",
                    firstName: data.data.firstName || "",
                    lastName: data.data.lastName || "",
                    profilePhoto: data.data.profilePhoto || ""
                }
                setUser(tempUser)
                console.log("Success temp user", user)
                getShifts(tempUser.userRole);
            })
            .catch(e => console.log("Error Staff", e))
    }

    function getShifts(userRole) {
        axios.get('http://localhost:5000/shiftTypes', {
            withCredentials: true,
            params: {role: userRole._id}
        })
            .then(data => setShifts(data.data))
            .catch(e => console.log("Error Roles", e))
    }

    const handleInputChange = (e) => {
        setUser({ ...user,[e.target.name]:e.target.value });
    }

    const handleFileChange = (e) => {
        setNewPhoto(e.target.files[0]);
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('profilePhoto', newPhoto);
        formData.append('userInput', JSON.stringify({
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            profilePhoto: user.profilePhoto
        }))

        axios.put(`http://localhost:5000/staff/${staffId}`, formData, {
            withCredentials: true,
            headers: {
                'Content-type': 'multipart/form-data'
        }})
            .then(data => {
                const tempUser = {
                    ...data.data,
                    email: data.data.email || "",
                    firstName: data.data.firstName || "",
                    lastName: data.data.lastName || "",
                    profilePhoto: data.data.profilePhoto || ""
                }
                setUser(tempUser);
                setNewPhoto("");
                console.log("Success!", data.data)
            })
            .catch(e => console.log("Error Staff", e))
    }

    if(!user) return (<h2>Loading</h2>);

    return (
        <div id="staffMemberInfoPage">
            <h2>Staff Member Setup</h2>
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
                Current Image: <UserAvatar user={user} />
                <div id="uploadImg-div">
                    <label htmlFor="raised-button-file">
                        <input accept="image/*" name="profilePhoto" onChange={handleFileChange}
                            style={{ display: 'none' }} id="raised-button-file" type="file"/>
                        <Button variant="contained" component="span" startIcon={<PhotoCamera />}>
                            Choose New Image
                        </Button>
                        {newPhoto && newPhoto.name}
                    </label> 
                    {/* <label>
                        <input name="profilePhoto" label="Image" type="file" onChange={handleFileChange} />
                        <Button>New Image</Button>
                    </label> */}
                </div>
                <Button variant="outlined" type="submit">Update</Button>
            </form>
            {shifts && <StaffWeeklyAvailability shifts={shifts}/>}
            <StaffRequestOff />
        </div>
        );
}

export default StaffMember;