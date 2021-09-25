import axios from "axios";
import React, { useState, useEffect } from "react";
import { Add, Remove } from '@material-ui/icons';

import NewShiftType from "./NewShiftType";
import ShiftRow from "./ShiftRow"

import Snackbar from '@material-ui/core/Snackbar';
import {Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper} from '@material-ui/core';

import './GeneralSetup.css';


const GeneralSetup = () => {
    const [shifts, setShifts] = useState([]);
    const [addNewShift, setAddNewShift] = useState(false);
    const [roles, setRoles] = useState([]);
    const [showSnackbar, setShowSnackbar] = useState(false);

    useEffect(() => {
        getShifts();
        getRoles();
    }, []);

    function getShifts() {
        axios.get('http://localhost:5000/shiftTypes', {withCredentials: true})
            .then(data => setShifts(data.data))
            .catch(e => console.log("Error Roles", e))
    }

    function getRoles() {
        axios.get('http://localhost:5000/userRole', {withCredentials: true})
            .then(data => setRoles(data.data))
            .catch(e => console.log("Error Roles", e))
    }

    const newShiftClick = (e) => {
        setAddNewShift(!addNewShift);
    }

    function ShowHide() {
        if (addNewShift) return <Remove onClick={newShiftClick} />
        return <Add onClick={newShiftClick} />
    } 

    function handleSnackClose() {
        setShowSnackbar(false);
    }

    function onShiftSave(id, ix, updatedShift) {
        axios.put(`http://localhost:5000/shiftTypes/${id}`, { updatedShift: updatedShift }, {withCredentials: true})
            .then(result => {
                const newShift = [...shifts];
                newShift[ix] = result.data;
                setShifts(newShift);
                setShowSnackbar(true);
            })
    }

    return (
        <div id="generalSetup">
            <h2>General Setup</h2>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="a dense table">
                    <TableHead id="tableHeaderBlue">
                    <TableRow>
                        <TableCell></TableCell>
                        <TableCell>Shift Name</TableCell>
                        <TableCell>Role</TableCell>
                        <TableCell>Default People Needed</TableCell>
                        <TableCell>Start Time</TableCell>
                        <TableCell>End Time</TableCell>
                    </TableRow>
                    </TableHead>
                    <TableBody>
                    {shifts.map((shift, ix) => (
                        <ShiftRow key={shift._id} shiftTypeInfo={shift} roles={roles} onShiftSave={(updatedShift) => onShiftSave(shift._id, ix, updatedShift)}/>
                    ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <div>
                <ShowHide />
                {(addNewShift) && <NewShiftType shifts={shifts} setShifts={setShifts} roles={roles}/>}
            </div>
            <Snackbar
                anchorOrigin={{vertical: 'top', horizontal: 'center'}}
                open={showSnackbar}
                onClose={handleSnackClose}
                message="Saved Updates"
                key={'top' + 'center'} />
        </div>
    );
}

export default GeneralSetup;