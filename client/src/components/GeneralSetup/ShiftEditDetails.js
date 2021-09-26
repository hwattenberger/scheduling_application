import React, { useState } from "react";

import { TextField, FormControl, Select, InputLabel, MenuItem, Button } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    formControl: {
      minWidth: 120
    }
  }));

const ShiftTypeDetail = ({shiftTypeInfo, roles, onShiftSave}) => {
    const classes = useStyles();

    const editedShiftType = {
        name: shiftTypeInfo.name || "",
        role: shiftTypeInfo.role || "",
        defNum: shiftTypeInfo.defNum || "",
        startTime: shiftTypeInfo.startTime || "",
        endTime: shiftTypeInfo.endTime || ""
    }

    const [shiftType, setShiftType] = useState(editedShiftType);

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

    const handleSaveShift = () => {
        onShiftSave(shiftType);
    }

    if (!roles) {
        return (<p>Please make a role first before creating shifts</p>)
    }

    if (shiftType) {
        return (
            <div>
                <h3>Edit Shift Information</h3>
                <div>
                    <TextField name="name" className="inputField" label="Shift Name" value={shiftType.name} onChange={handleInputChange} />
                </div>
                <div>
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
                </div>
                <div>
                    <TextField name="defNum" className="inputField" label="Defalt Number" value={shiftType.defNum} onChange={handleInputChange} />
                </div>
                <div>
                    <TextField name="startTime" className="inputField" label="Start Time" value={shiftType.startTime} onChange={handleInputChange} />
                </div>
                <div>
                    <TextField name="endTime" className="inputField" label="End Time" value={shiftType.endTime} onChange={handleInputChange} />
                </div>
                <Button variant="outlined" id="saveStaffBtn" onClick={handleSaveShift}>Save</Button>
            </div>
        )
    }
}

export default ShiftTypeDetail;