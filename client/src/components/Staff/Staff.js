import axios from "axios";
import React, { useState, useEffect } from "react";
import './Staff.css';
import randomImg from "../../randomimg.png"
import { render } from "react-dom";

const UserRoleEdit = ({person, ix, roles, onEdit}) => {
    const [currentValue, setCurrentValue] = useState(person.userRole._id);
    const [editMode, setEditMode] = useState(false);

    function editRole() {
        setEditMode(true);
    }

    function handleChange(e) {
        setCurrentValue(e.target.value);
        console.log("Changed", e.target.value);
        console.log("Test", onEdit)
        onEdit(person._id, ix, {userRole: e.target.value});
    }

    return (
        <div onClick={editRole}>
            Role:
            <select value={currentValue} onChange={handleChange}>
                {roles.map((role) => (
                    <option key={role._id} value={role._id}>{role.name}</option>
                ))}
            </select>
        </div>
        );
}

const Staff = (props) => {
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
                    <UserRoleEdit person={person} ix={ix} roles={roles} onEdit={editStaff}/>
                    <div>{person.hourlyPay}</div>
                    {/* <UserRoleEdit person={person} ix={ix} roles={roles} onEdit={() => editStaff(person._id, ix, {})}/> */}
                    {/* {userRole(person, ix)} */}
                    {/* <div>Role: {person.userRole && person.userRole.name}</div>
                    <div onClick={() => editStaff(person._id, ix)}>{!person.userRole && "hi"}</div> */}
                </div>
            ))}
        </div>
    );
}

export default Staff;