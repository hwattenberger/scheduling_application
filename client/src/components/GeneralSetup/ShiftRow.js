import React, { useState } from "react";

import UserAvatar from '../General/UserAvatar'
import ShiftEditDetails from './ShiftEditDetails'

import {KeyboardArrowDown, KeyboardArrowUp} from '@material-ui/icons';
import {TableCell, TableRow, IconButton, Collapse} from '@material-ui/core';


const ShiftRow = ({shiftTypeInfo, roles, onShiftSave}) => {
    const [open, setOpen] = useState(false);

    return (
        <React.Fragment>
            <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell>
                    <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
                        {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                    </IconButton>
                </TableCell>
                <TableCell component="th" scope="row">
                    {shiftTypeInfo.name}
                </TableCell>
                <TableCell>{shiftTypeInfo.role.name}</TableCell>
                <TableCell>{shiftTypeInfo.defNum}</TableCell>
                <TableCell>{shiftTypeInfo.startTime}</TableCell>
                <TableCell>{shiftTypeInfo.endTime}</TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <ShiftEditDetails shiftTypeInfo={shiftTypeInfo} roles={roles} onShiftSave={onShiftSave}/>
                    </Collapse>
                </TableCell>
            </TableRow>
        </React.Fragment>
    )
}

export default ShiftRow