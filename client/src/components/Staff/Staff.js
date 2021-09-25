import axios from "axios";
import React, { useState, useEffect } from "react";
import './Staff.css';
import StaffRow from './StaffRow'
import UserRoleFilter from './UserRoleFilter'

import Snackbar from '@material-ui/core/Snackbar';
import {Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper} from '@material-ui/core';
import FilterListIcon from '@material-ui/icons/FilterList';


const Staff = () => {
    const [staff, setStaff] = useState([]);
    const [roles, setRoles] = useState([]);
    const [filterRole, setFilterRole] = useState("");
    const [showSnackbar, setShowSnackbar] = useState(false);


    useEffect(() => {
        getStaff();
        getRoles();
    }, []);

    function getStaff() {
        axios.get('http://localhost:5000/staff', {withCredentials: true})
            .then(data => setStaff([...data.data]))
    }

    function editStaff(id, ix, updatedStaff) {
        axios.put(`http://localhost:5000/staff/${id}`, { updatedStaff: updatedStaff }, {withCredentials: true})
            .then(result => {
                console.log("WoW", result, ix)
                const newStaff = [...staff];
                newStaff[ix] = result.data;
                setStaff(newStaff);
                setShowSnackbar(true);
            })
    }

    function getRoles() {
        axios.get('http://localhost:5000/userRole', {withCredentials: true})
            .then(data => setRoles(data.data))
    }

    function handleSnackClose() {
        setShowSnackbar(false);
    }

    return (
        <div id="staffPage">
            <h2>Staff</h2>
            <div id="filterStaffDiv">
                <FilterListIcon /><UserRoleFilter filterRole={filterRole} setFilterRole={setFilterRole} roles={roles} />
            </div>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="a dense table">
                    <TableHead id="tableHeaderBlue">
                    <TableRow>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell>Name</TableCell>
                        <TableCell>Email</TableCell>
                        <TableCell>User Role</TableCell>
                    </TableRow>
                    </TableHead>
                    <TableBody>
                    {staff.map((person, ix) => (
                        <StaffRow filterRole={filterRole} person={person} ix={ix} key={person._id} roles={roles} editStaff={(updatedStaff) => editStaff(person._id, ix, updatedStaff)}/>
                    ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Snackbar
                anchorOrigin={{vertical: 'top', horizontal: 'center'}}
                open={showSnackbar}
                onClose={handleSnackClose}
                message="Saved User Update"
                key={'top' + 'center'} />
        </div>
    );
}

export default Staff;