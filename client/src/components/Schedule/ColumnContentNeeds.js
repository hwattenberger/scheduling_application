import React, { useState, useEffect } from "react";
import axios from "axios";
import './Schedule.css';


const DailyNeeds = ({dayIx, schedule}) => {

    const dragStart = (e, shiftsType) => {
        e.dataTransfer.setData('object', JSON.stringify(shiftsType.shifts[0]));
        e.dataTransfer.setData('dayIx', dayIx);
        console.log("Drag Start", dayIx, shiftsType.shifts[0]);
    }

    return (
        <div className="dailyNeedsContainer">
            {schedule[dayIx].shiftsByRole.map((shiftsType) => (
                <div key={shiftsType.role._id} className="shiftsDayBlock" id={`${dayIx}^${shiftsType.shifts[0].shift.id}`} 
                  draggable onDragStart={(e) => dragStart(e, shiftsType)}>
                    <div>{shiftsType.shifts[0].shift.name}</div>
                    <div>{shiftsType.shifts[0].peopleNeeded}</div>
                </div>
            ))}
        </div>
    )
}

const ColumnContentNeeds = ({columnIx, weeklySchedule, shifts}) => {
    // return null;
    if(shifts === null || weeklySchedule === null) return null;
    // if (columnIx === 0) return (<NeedsHeader weeklySchedule={weeklySchedule} shifts={shifts}/>)
    // return (<DailyNeeds dayIx={columnIx-1} weeklySchedule={weeklySchedule}/>)
    return null;
}


const NeedsHeader = ({weeklySchedule, shifts}) => {
    return (
        <div className="dailyNeedsContainer">
            {weeklySchedule[0].scheduleShifts.map((scheduleShift) => (

                <div key={shifts[scheduleShift.shift]._id} className="shiftsDayBlock">
                    {shifts[scheduleShift.shift]._id}
                </div>
            ))}
        </div>
    )
}

export default ColumnContentNeeds;