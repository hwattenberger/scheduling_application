import React, { useState } from "react";

import { TextField, FormControl, Select, InputLabel, Checkbox, MenuItem, FormControlLabel, Button } from '@material-ui/core'

import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    formControl: {
      minWidth: 100
    }
}));

const StaffEditDetails = ({person, roles, editStaff}) => {
    const classes = useStyles();

    const defaultPersonValues = {
        firstName: person.firstName || "",
        lastName: person.lastName || "",
        email: person.email || "",
        isAdmin: person.isAdmin || false,
        userRole: (person.userRole && person.userRole._id) || "",
        isActive: ( person.isActive == null ? true : person.isActive),
        hourlyPay: person.hourlyPay || ""
    };

    const [staffInfo, setStaffInfo] = useState(defaultPersonValues);

    const handleInputChange = (e) => {
        setStaffInfo({ ...staffInfo,[e.target.name]:e.target.value });
    }

    const handleCheckedChange = (e) => {
        setStaffInfo({ ...staffInfo,[e.target.name]:e.target.checked });
    }

    const handleInputChangeRole = (e) => {
        setStaffInfo({...staffInfo,"userRole":e.target.value});
    }

    const onSave = (e) => {
        e.preventDefault();
        editStaff(staffInfo);
    }

    return (
        <div className="editStaffDiv">
            <h3>Staff Details</h3>
            <div id="editStaffColumn1">
                <div>
                    <TextField name="firstName" className="inputField" label="First Name" value={staffInfo.firstName} onChange={handleInputChange} />
                </div>
                <div>
                    <TextField name="lastName" className="inputField" label="Last Name" value={staffInfo.lastName} onChange={handleInputChange} />
                </div>
                <div>
                    <TextField name="email" className="inputField" label="Email" value={staffInfo.email} onChange={handleInputChange} />
                </div>
                <div>
                    <TextField name="hourlyPay" className="inputField" label="Hourly Pay" value={staffInfo.hourlyPay} onChange={handleInputChange} />
                </div>
                <div>
                    <FormControl className={classes.formControl}>  
                        <InputLabel id="role-select-label">Role</InputLabel>
                        <Select labelId="role-select-label" value={staffInfo.userRole} name="role" onChange={handleInputChangeRole}>
                            <MenuItem value="">
                                <em>Show All</em>
                            </MenuItem>
                            {roles.map((role) => (
                                <MenuItem key={role._id} value={role._id}>{role.name}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </div>
                <Button variant="outlined" id="saveStaffBtn" onClick={onSave}>Save</Button>
            </div>
            <div id="editStaffColumn2">
                <div>
                <FormControlLabel control={<Checkbox checked={staffInfo.isAdmin} onChange={handleCheckedChange} name="isAdmin" />} label="Admin?" />
                </div>
                <div>
                    <FormControlLabel control={<Checkbox checked={staffInfo.isActive} onChange={handleCheckedChange} name="isActive" />} label="Active?" />
                </div>
            </div>
            <div id="editStaffColumn3">
                Go <a href={`/staff/${person._id}`}>here</a> to see schedule and timeoff details
            </div>
        </div>
    )
}

export default StaffEditDetails