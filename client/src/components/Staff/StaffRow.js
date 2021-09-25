import React, { useState } from "react";

import UserAvatar from '../General/UserAvatar'
import StaffEditDetails from './StaffEditDetails'

import {KeyboardArrowDown, KeyboardArrowUp} from '@material-ui/icons';
import {TableCell, TableRow, IconButton, Collapse} from '@material-ui/core';


const StaffRow = ({filterRole, person, roles, editStaff}) => {
    const [open, setOpen] = useState(false);

    if(filterRole && !person.userRole) return null;
    if(filterRole && person.userRole._id !== filterRole) return null;

    return (
        <React.Fragment>
            <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell>
                    <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
                        {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                    </IconButton>
                </TableCell>
                <TableCell component="th" scope="row">
                    <UserAvatar user={person}/>
                </TableCell>
                <TableCell>{person.firstName} {person.lastName}</TableCell>
                <TableCell>{person.email}</TableCell>
                <TableCell>{person.userRole && person.userRole.name}</TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={5}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <StaffEditDetails person={person} roles={roles} editStaff={editStaff}/>
                    </Collapse>
                </TableCell>
            </TableRow>
        </React.Fragment>
    )
}

export default StaffRow