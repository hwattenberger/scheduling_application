import axios from "axios";
import React, { useState, useEffect } from "react";
import './Staff.css';
import randomImg from "../../randomimg.png"

import TextField from '@material-ui/core/TextField'
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import { makeStyles } from '@material-ui/core/styles';

import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

const useStyles = makeStyles((theme) => ({
    formControl: {
      minWidth: 100
    }
  }));

// const UserRoleEdit = ({person, ix, roles, onEdit}) => {
//     const [currentValue, setCurrentValue] = useState(person.userRole._id);
//     const [editMode, setEditMode] = useState(false);

//     function editRole() {
//         setEditMode(true);
//     }

//     function handleChange(e) {
//         setCurrentValue(e.target.value);
//         console.log("Changed", e.target.value);
//         console.log("Test", onEdit)
//         onEdit(person._id, ix, {userRole: e.target.value});
//     }

//     return (
//         <div onClick={editRole}>
//             Role:
//             <select value={currentValue} onChange={handleChange}>
//                 {roles.map((role) => (
//                     <option key={role._id} value={role._id}>{role.name}</option>
//                 ))}
//             </select>
//         </div>
//         );
// }

const UserRoleEdit = ({person, roles, onEdit}) => {
    const [userRole, setUserRole] = useState(person.userRole._id);
    const classes = useStyles();

    const handleInputChangeRole = (e) => {
        let newRole = "";
        
        roles.forEach((role) => {
            if (e.target.value === role._id) newRole = role
        })

        setUserRole(newRole._id);
        onEdit({userRole: newRole._id})
    }

    return (
        <FormControl className={classes.formControl}>
            <InputLabel id="role-select-label">Role</InputLabel>
            <Select labelId="role-select-label" value={userRole} name="role" onChange={handleInputChangeRole}>
            <MenuItem value="" disabled>
                <em>None</em>
            </MenuItem>
            {roles.map((role) => (
                <MenuItem key={role._id} value={role._id}>{role.name}</MenuItem>
            ))}
            </Select>
        </FormControl>
    )
}

const IsAdminEdit = ({person, onEdit}) => {
    const [isAdmin, setIsAdmin] = useState(person.isAdmin || false);

    const handleCheckmarkChange = (e) => {
        console.log("Check?", e.target.checked)

        setIsAdmin(e.target.checked);
        onEdit({isAdmin: e.target.checked});
    }

    return (
        <FormControlLabel
        label="Admin"
        control={<Checkbox checked={isAdmin} onChange={handleCheckmarkChange} name="isAdmin" />}
        />
    )
}

const Staff = () => {
    const [staff, setStaff] = useState([]);
    const [roles, setRoles] = useState([]);

    useEffect(() => {
        getStaff();
        getRoles();
    }, []);

    function getStaff() {
        axios.get('http://localhost:5000/staff', {withCredentials: true})
            .then(data => setStaff([...data.data]))
            .catch(e => console.log("Error Staff", e))
    }

    function editStaff(id, ix, updatedStaff) {
        console.log("Edit staff", id, ix, updatedStaff)
        axios.put(`http://localhost:5000/staff/${id}`, {
            withCredentials: true,
            body: updatedStaff
        })
            .then(result => {
                console.log("WoW", result)
                const newStaff = [...staff];
                newStaff[ix] = result.data;
                setStaff(newStaff);
            })
    }

    function getRoles() {
        axios.get('http://localhost:5000/userRole', {withCredentials: true})
            .then(data => setRoles(data.data))
            .catch(e => console.log("Error Roles", e))
    }

    return (
        <div id="staffPage">
            <h2>Staff</h2>
            {/* {console.log("STAFF", staff)} */}
            {staff.map((person, ix) => (
                <div key={person._id} className="staffLine">
                    <a href={`/staff/${person._id}`}><img className="userPicture" src={randomImg}></img></a>
                    <div>{person.firstName} {person.lastName}</div>
                    <div>{person.email}</div>
                    <UserRoleEdit person={person} roles={roles} onEdit={(updStaff) => editStaff(person._id, ix, updStaff)} />
                    <div><IsAdminEdit person={person} onEdit={(updStaff) => editStaff(person._id, ix, updStaff)} /></div>
                </div>
            ))}
        </div>
    );
}

export default Staff;