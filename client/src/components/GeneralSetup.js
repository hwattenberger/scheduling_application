import axios from "axios";
import React, { useState, useEffect } from "react";
import { Add, Remove, Edit } from '@material-ui/icons';
import './GeneralSetup.css';

import TextField from '@material-ui/core/TextField'
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import { makeStyles } from '@material-ui/core/styles';

const newShiftTypeObject = {
    name: "",
    role: "",
    defNum: 0,
    endTime: "",
    startTime: ""
}

const NewShiftType = ({setShifts, shifts, roles}) => {
    const classes = useStyles();
    const [shiftType, setShiftType] = useState(newShiftTypeObject);
    
    function createShiftType(e) {
        e.preventDefault();
        console.log("SHIFT TYPE NAME", shiftType.name)
        if (!shiftType.name) return "";

        axios.post(`http://localhost:5000/shifts`, {
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
    
    return (
        <div id="createShiftDiv">
            <form onSubmit={createShiftType}>
                <TextField name="name" className="inputField" label="Shift Name" value={shiftType.name} onChange={handleInputChange} />

                <FormControl className={classes.formControl}>
                    <InputLabel id="role-select-label">Role Needed</InputLabel>
                    <Select labelId="role-select-label" id="demo-simple-select" value={shiftType.role} name="role" onChange={handleInputChange}>
                    <MenuItem value="">
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
            {console.log("Shift Types", shiftType)}
                <span onClick={handleSaveShift}>
                    <Edit />
                </span>
                <TextField name="name" className="inputField" label="Shift Name" value={shiftType.name} onChange={handleInputChange} />

                <FormControl className={classes.formControl}>
                    <InputLabel id="role-select-label">Role Needed</InputLabel>
                    <Select labelId="role-select-label" id="demo-simple-select" value={shiftType.role._id} name="role" onChange={handleInputChangeRole}>
                    <MenuItem value={undefined}>
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

const GeneralSetup = (props) => {
    const [shifts, setShifts] = useState([]);
    const [addNewShift, setAddNewShift] = useState(false);
    const [roles, setRoles] = useState([]);

    useEffect(() => {
        getShifts();
        getRoles();
    }, []);

    function getShifts() {
        axios.get('http://localhost:5000/shifts', {withCredentials: true})
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
        // setAddNewShift(!addNewShift);
    }

    function ShowHide() {
        if (addNewShift) return <Remove onClick={newShiftClick} />
        return <Add onClick={newShiftClick} />
    } 

    function onShiftSave(id, ix, updatedShift) {
        console.log("Edit shift", id, ix, updatedShift)

        axios.put(`http://localhost:5000/shifts/${id}`, {
            withCredentials: true,
            body: updatedShift
        })
            .then(result => {
                console.log("WoW", result)
                const newShift = [...shifts];
                newShift[ix] = result.data;
                setShifts(newShift);
            })
    }


    return (
        <div id="generalSetup">
            <h2>General Setup</h2>

            <div>
                <h3>Shifts:</h3>
                {shifts.map((shift, ix) => (
                    <ShiftTypeDetail key={shift._id} shiftTypeInfo={shift} roles={roles} onShiftSave={onShiftSave} ix={ix}/>
                ))}
            </div>
            <div>
                <ShowHide />
                {(addNewShift) && <NewShiftType shifts={shifts} setShifts={setShifts} roles={roles}/>}
            </div>
        </div>
    );
}

export default GeneralSetup;