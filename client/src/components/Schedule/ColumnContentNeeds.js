import React, { useState, useEffect } from "react";
import axios from "axios";
import './Schedule.css';


const DailyNeeds = ({dayIx, schedule}) => {

    return (
        <div className="dailyNeedsContainer">
            {schedule[dayIx].shiftsByRole.map((shiftsType) => (
                <div key={shiftsType.role._id} className="shiftsDayBlock" id={`${dayIx}^${shiftsType.shifts[0].shift.id}`}>
                    {shiftsType.shifts[0].shift.name}
                    {shiftsType.shifts[0].peopleNeeded}
                </div>
            ))}
        </div>
    )
}

const ColumnContentNeeds = ({columnIx, schedule}) => {
    if (schedule.length === 0) return null;
    if (columnIx === 0) return (<NeedsHeader schedule={schedule}/>)
    return (<DailyNeeds dayIx={columnIx-1} schedule={schedule}/>)
}


const NeedsHeader = ({schedule}) => {
    return (
        <div className="dailyScheduleContainer">
            {schedule[0].shiftsByRole.map((shiftsType) => (
                <div key={shiftsType.role._id} className="shiftsDayBlock">
                    {shiftsType.role.name}
                </div>
            ))}
        </div>
    )
}

export default ColumnContentNeeds;