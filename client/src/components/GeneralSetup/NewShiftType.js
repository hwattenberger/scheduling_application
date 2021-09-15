import axios from "axios";
import React, { useState } from "react";

import TextField from '@material-ui/core/TextField'
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
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
    
    function createShiftType(e) {
        e.preventDefault();
        console.log("SHIFT TYPE NAME", shiftType.name)
        if (!shiftType.name) return "";

        axios.post(`http://localhost:5000/shiftTypes`, {
            withCredentials: true,
            body: shiftType
        })
            .then(data => {
                setShiftType(newShiftTypeObject);
                setShifts([...shifts, data.data] )
            })
            .catch(e => console.log("Error Creating a Shift Type", e))
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
            <form onSubmit={createShiftType}>
                <TextField name="name" className="inputField" label="Shift Name" value={shiftType.name} onChange={handleInputChange} />

                <FormControl className={classes.formControl}>
                    <InputLabel id="role-select-label">Role Needed</InputLabel>
                    <Select labelId="role-select-label" value={shiftType.role._id} name="role" onChange={handleInputChangeRole}>
                    <MenuItem value="" disabled>
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
                <input type="submit" value="Create" />
            </form>
        </div>
    )
}

export default NewShiftType;