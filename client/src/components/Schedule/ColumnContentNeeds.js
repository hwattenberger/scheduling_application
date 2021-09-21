import React from "react";
// import axios from "axios";
import './Schedule.css';
import Badge from '@material-ui/core/Badge';

const ShiftDetail = ({dayIx, scheduleShift, shifts}) => {

    const dragStart = (e, scheduleShift) => {
        e.dataTransfer.setData('object', JSON.stringify(scheduleShift._id));
        e.dataTransfer.setData('dayIx', dayIx);
        console.log("Drag Start", dayIx, scheduleShift._id);
    }

    const bgColor = (shift) => {
        const color = shifts[shift] && shifts[shift].role.color;
        return {backgroundColor: color};
    }

    //Don't show if shift is full
    if (scheduleShift.peopleNeeded - scheduleShift.peopleAssigned.length <= 0) return null;

    return (
        <Badge badgeContent={scheduleShift.peopleNeeded - scheduleShift.peopleAssigned.length} color="primary">
            <div className="shiftsDayBlock" id={scheduleShift._id}
                draggable onDragStart={(e) => dragStart(e, scheduleShift)} style={bgColor(scheduleShift.shift)}>
                <div className="scheduleShiftName">{shifts[scheduleShift.shift] && shifts[scheduleShift.shift].name}</div>
            </div>
        </Badge>
    )
}

const DailyNeeds = ({dayIx, weeklySchedule, shifts}) => {

    return (
        <div className="dailyNeedsContainer">
            {weeklySchedule.days[dayIx].scheduleShifts.map((scheduleShift) => (
                <ShiftDetail key={scheduleShift._id} dayIx={dayIx} scheduleShift={scheduleShift} shifts={shifts}/>
            ))}
        </div>
    )
}

const ColumnContentNeeds = ({columnIx, weeklySchedule, shifts}) => {
    // return null;
    if(!shifts || !weeklySchedule) return null;
    if (columnIx === 0) return (<NeedsHeader weeklySchedule={weeklySchedule} shifts={shifts}/>)
    return (<DailyNeeds dayIx={columnIx-1} weeklySchedule={weeklySchedule} shifts={shifts}/>)
    return null;
}


const NeedsHeader = ({weeklySchedule, shifts}) => {
    // console.log("Needs Header", shifts)
    // console.log("Header schedule", weeklySchedule.days[0].scheduleShifts)
    return (
        <div className="dailyNeedsContainer">
            {/* {weeklySchedule.days[0].scheduleShifts.map((scheduleShift) => (
                <div key={shifts[scheduleShift.shift]._id} className="shiftsDayBlock">
                    {shifts[scheduleShift.shift].name}
                </div>
            ))} */}
        </div>
    )
}

export default ColumnContentNeeds;