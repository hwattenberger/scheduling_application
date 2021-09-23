import {useParams} from "react-router-dom";
import axios from "axios";
import React, { useState, useEffect } from "react";
import Button from '@material-ui/core/Button'
import Snackbar from '@material-ui/core/Snackbar';


const StaffWeeklyAvailability = ({shifts}) => {
    const [userWeeklyAvail, setUserWeeklyAvail] = useState([]);
    const week = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    const { staffId } = useParams();
    const [showComplete, setShowComplete] = useState(false);

    useEffect(() => {
        if (shifts.length) getWeeklyAvailability();
    }, [shifts]);

    function getWeeklyAvailability() {
        axios.get(`http://localhost:5000/staff/${staffId}/available`, { withCredentials: true })
            .then(data => {
                const weeklyAvailabilityQuery = data.data
                if (weeklyAvailabilityQuery.length > 0) {
                    console.log("Data data", weeklyAvailabilityQuery)
                    
                    const savedShifts = weeklyAvailabilityQuery[0].shiftAvailability.map((shift) => shift.shiftType._id);
                    const shiftsIds = shifts.map((shift) => shift._id);

                    shifts.forEach((shift) => {
                        //If this shift wasn't saved with the availability.
                        if (!savedShifts.includes(shift._id)) {
                            weeklyAvailabilityQuery.forEach((day) => {
                                const shiftInfo = {
                                    shiftType: shift,
                                    isAvailable: false
                                };
                                day.shiftAvailability.push(shiftInfo);
                            })

                        }
                    })

                    savedShifts.forEach((shift, storedIndex) => {
                        //If this saved shift is no longer appropriate
                        if(!shiftsIds.includes(shift)) {
                            weeklyAvailabilityQuery.forEach((day) => {
                                day.shiftAvailability.splice(storedIndex, 1)
                            })
                        }
                    })

                    setUserWeeklyAvail(weeklyAvailabilityQuery);
                } else setupNewWeeklyShifts();
            })
            .catch(e => console.log("Error - Couldn't get weekly schedule", e))
    }

    function putWeeklyAvailability(e) {
        e.preventDefault();

        axios.put(`http://localhost:5000/staff/${staffId}/available`, { 
            withCredentials: true,
            body: userWeeklyAvail
        })
            .then(data => setShowComplete(true))
            .catch(e => console.log("Error - Couldn't get weekly schedule", e))
    }

    function setupNewWeeklyShifts() {
        console.log("New User Creating Shifts")
        const weeklyShifts = new Array();
        week.forEach((day, dayIx) => {
            weeklyShifts[dayIx] = {
                shiftAvailability: shifts.map((shift) => {
                    const shiftInfo = {
                        shiftType: shift,
                        isAvailable: false
                    };
                    return shiftInfo;
                })
            }
        })
        // console.log(weeklyShifts)
        setUserWeeklyAvail(weeklyShifts);
    }

    function handleSnackClose() {
        setShowComplete(false);
    }

    const handleShiftClick = (ix, dayShiftIx) => {
        const TempUserWeeklyAvail = [...userWeeklyAvail]
        const TempShift = userWeeklyAvail[ix].shiftAvailability[dayShiftIx];
        const currentAvail = TempShift.isAvailable
        TempUserWeeklyAvail[ix].shiftAvailability[dayShiftIx] = {...TempShift, isAvailable: !currentAvail}
        setUserWeeklyAvail(TempUserWeeklyAvail);
    }

    if (userWeeklyAvail.length === 0) return (
        <div id="weeklyAvaiability">
            <h2>Your weekly availability</h2>
            No shifts available - work with your manager to update your role
        </div>
    )

    return (
        <div id="weeklyAvaiability">
            <h2>Your weekly availability</h2>
            <div id="weekDiv">
                { userWeeklyAvail.map((day, ix) => (
                    <div key={ix} className="weekday-div">
                        <span className="dayName">{week[ix]}</span>
                        { day.shiftAvailability.map((dayShift, dayShiftIx) => (
                            <div className={`shiftDiv ${dayShift.isAvailable ? "shiftDivActive" : "shiftDivInactive"}`} key={dayShift.shiftType._id} onClick={() => handleShiftClick(ix, dayShiftIx)}>
                                <div>{dayShift.shiftType.name}</div>
                                <div>{dayShift.shiftType.startTime} - {dayShift.shiftType.endTime}</div>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
            <Button variant="outlined" onClick={putWeeklyAvailability}>Save Shifts</Button>
            <Snackbar
                anchorOrigin={{vertical: 'top', horizontal: 'center'}}
                open={showComplete}
                onClose={handleSnackClose}
                message="Weekly Availability Saved"
                key={'top' + 'center'} />
        </div>
    )
}

export default StaffWeeklyAvailability;