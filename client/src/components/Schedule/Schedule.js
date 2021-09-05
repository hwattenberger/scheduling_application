import React, { useState, useEffect } from "react";
import axios from "axios";
import './Schedule.css';



const Schedule = (props) => {
    const week = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    const [shifts, getShifts] = useState([]);
    const [roles, getRoles] = useState({});
    const [availability, getWeeklyAvailability] = useState([]);
    const [firstDayOfWeek, getFirstDayOfWeek] = useState();

    useEffect(() => {
        pullShifts();
    }, []);

    useEffect(() => {
        const uniqueRoles = {};
        shifts.forEach((shift) => {
            if (!uniqueRoles[shift.role._id]) uniqueRoles[shift.role._id] = shift.role.name;
        })
        console.log("UR", uniqueRoles)
        getRoles(uniqueRoles)
        // getRoles(shifts.map(shift => {
        //     const updShift = {
        //         _id: shift._id,
        //         name: shift.name
        //     };
        //     return updShift;
        // }).filter((role, ix, self) => self.indexOf(role) === ix))
    }, [shifts]);

    function pullShifts() {
        axios.get('http://localhost:5000/shifts', {withCredentials: true})
            .then(data => {getShifts([...data.data]) 
                console.log("Shifts", data.data)})
            .catch(e => console.log("Error Staff", e))
    }

    return (
        <div id="mainSchedule">
            <h2>Schedule</h2>
            {JSON.stringify(shifts)}
            Roles: {JSON.stringify(roles)}
            <div id="mainWeekDiv">
                <div className="weekday-div"></div>
                {week.map((day, dayIx) => (
                    <div key={dayIx} className="weekday-div">
                        <span className="dayName">{day}</span>
                        
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Schedule;