import axios from "axios";
import React, { useState, useEffect } from "react";
import { Add, Remove } from '@material-ui/icons';
import NewShiftType from "./NewShiftType";
import ShiftTypeDetail from "./ShiftTypeDetail";
import './GeneralSetup.css';


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
    }

    function ShowHide() {
        if (addNewShift) return <Remove onClick={newShiftClick} />
        return <Add onClick={newShiftClick} />
    } 

    function onShiftSave(id, ix, updatedShift) {
        // console.log("Edit shift", id, ix, updatedShift)

        axios.put(`http://localhost:5000/shifts/${id}`, {
            withCredentials: true,
            body: updatedShift
        })
            .then(result => {
                // console.log("WoW", result)
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