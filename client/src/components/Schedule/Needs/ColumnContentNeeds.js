import React, { useEffect } from "react";
import Badge from '@material-ui/core/Badge';

const ShiftDetail = ({scheduleShift, shifts, filterRole}) => {

    const dragStart = (e, scheduleShift) => {
        e.dataTransfer.setData('shiftType', scheduleShift.shift);
    }

    const bgColor = (shift) => {
        const color = shifts[shift] && shifts[shift].role.color;
        return {backgroundColor: color};
    }

    //Don't show if shift is full
    if (scheduleShift.peopleNeeded - scheduleShift.peopleAssigned.length <= 0) return null;

    if (filterRole && shifts[scheduleShift.shift].role._id !== filterRole) return null;

    return (
        <Badge badgeContent={scheduleShift.peopleNeeded - scheduleShift.peopleAssigned.length} color="primary">
            <div className="shiftsDayBlock" id={scheduleShift._id}
                draggable onDragStart={(e) => dragStart(e, scheduleShift)} style={bgColor(scheduleShift.shift)}>
                <div className="scheduleShiftName">{shifts[scheduleShift.shift] && shifts[scheduleShift.shift].name}</div>
            </div>
        </Badge>
    )
}

const DailyNeeds = ({dayIx, weeklySchedule, shifts, filterRole}) => {

    return (
        <div className="dailyNeedsContainer">
            {weeklySchedule.days[dayIx].scheduleShifts.map((scheduleShift) => (
                <ShiftDetail key={scheduleShift._id} scheduleShift={scheduleShift} shifts={shifts} filterRole={filterRole}/>
            ))}
        </div>
    )
}

const ColumnContentNeeds = ({columnIx, weeklySchedule, shifts, filterRole}) => {
    useEffect(() => {
        }, [shifts]);
    
    if(!shifts || !weeklySchedule) return null;
    if (columnIx === 0) return (<NeedsHeader />)
    return (<DailyNeeds dayIx={columnIx-1} weeklySchedule={weeklySchedule} shifts={shifts} filterRole={filterRole}/>)
}


const NeedsHeader = () => {
    return (
        <div className="dailyNeedsContainer">
        </div>
    )
}

export default ColumnContentNeeds;