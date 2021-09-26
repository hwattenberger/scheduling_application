import axios from "axios";
import React, { useState } from "react";

import TextField from '@material-ui/core/TextField'
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';

const newShiftTypeObject = {
    name: "",
    role: {
        name: "Unknown",
        _id: ""
    },
    defNum: 0,
    endTime: "",
    startTime: ""
}

const useStyles = makeStyles((theme) => ({
    formControl: {
      minWidth: 120
    }
  }));

const NewShiftType = ({setShifts, shifts, roles}) => {
    const classes = useStyles();
    const [shiftType, setShiftType] = useState(newShiftTypeObject);
    const baseURL = process.env.REACT_APP_API_BASE_URL;
    
    function createShiftType(e) {
        e.preventDefault();
        console.log("SHIFT TYPE NAME", shiftType.name)
        if (!shiftType.name) return "";

        axios.post(`${baseURL}/shiftTypes`, { shiftType: shiftType }, {withCredentials: true})
            .then(data => {
                setShiftType(newShiftTypeObject);
                setShifts([...shifts, data.data] )
            })
    }

    const handleInputChange = (e) => {
        setShiftType({...shiftType,[e.target.name]:e.target.value });
    }

    const handleInputChangeRole = (e) => {
        let newRole = "";
        
        roles.forEach((role) => {
            if (e.target.value === role._id) newRole = role
        })

        setShiftType({ ...shiftType,[e.target.name]:newRole});
    }
    
    return (
        <div id="createShiftDiv">
            <h3>Create New Shift</h3>
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
                <Button variant="outlined" id="saveStaffBtn" onClick={createShiftType}>Save</Button>
        </div>
    )
}

export default NewShiftType;