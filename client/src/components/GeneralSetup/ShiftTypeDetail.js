import React, { useState } from "react";
import { Edit } from '@material-ui/icons';

import TextField from '@material-ui/core/TextField'
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    formControl: {
      minWidth: 120
    }
  }));

const ShiftTypeDetail = ({shiftTypeInfo, roles, onShiftSave, ix}) => {
    const classes = useStyles();

    const editedShiftType = {
        name: shiftTypeInfo.name || "",
        role: shiftTypeInfo.role || "",
        defNum: shiftTypeInfo.defNum || "",
        startTime: shiftTypeInfo.startTime || "",
        endTime: shiftTypeInfo.endTime || ""
    }

    const [shiftType, setShiftType] = useState(editedShiftType);
    // const [editShift, setEditShift] = useState(false);

    const handleInputChange = (e) => {
        setShiftType({ ...shiftType,[e.target.name]:e.target.value });
    }

    const handleInputChangeRole = (e) => {
        let newRole = "";
        
        roles.forEach((role) => {
            if (e.target.value === role._id) newRole = role
        })

        setShiftType({ ...shiftType,[e.target.name]:newRole});
    }

    const handleSaveShift = (e) => {
        onShiftSave(shiftTypeInfo._id, ix, shiftType);
    }

    if (!roles) {
        return (<p>Please make a role first before creating shifts</p>)
    }

    if (shiftType) {
        return (
            <div className="listDiv">
                <span onClick={handleSaveShift}>
                    <Edit />
                </span>
                <TextField name="name" className="inputField" label="Shift Name" value={shiftType.name} onChange={handleInputChange} />

                <FormControl className={classes.formControl}>
                    <InputLabel id="role-select-label">Role Needed</InputLabel>
                    <Select labelId="role-select-label" value={shiftType.role._id} name="role" onChange={handleInputChangeRole}>
                    <MenuItem value={undefined} disabled>
                        <em>None</em>
                    </MenuItem>
                        {roles.map((role) => (
                            <MenuItem key={role._id} value={role._id}>{role.name}</MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <TextField name="defNum" className="inputField" label="Defalt Number" value={shiftType.defNum} onChange={handleInputChange} />
                <TextField name="startTime" className="inputField" label="Start Time" value={shiftType.startTime} onChange={handleInputChange} />
                <TextField name="endTime" className="inputField" label="End Time" value={shiftType.endTime} onChange={handleInputChange} />
            </div>
        )
    }
}

export default ShiftTypeDetail;