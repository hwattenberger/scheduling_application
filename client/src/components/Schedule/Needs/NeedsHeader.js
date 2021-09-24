import React from "react";

import NeedsDayHeader from './NeedsDayHeader'


const NeedsHeader = ({day, date, columnIx, weeklySchedule, shifts, setDaySchedule}) => {
    if (columnIx === 0) return null;
    return (
        <NeedsDayHeader day={day} date={date} dayIx={columnIx-1} daySchedule={{...weeklySchedule.days[columnIx-1]}} shifts={shifts} setDaySchedule={setDaySchedule} />
    )
}

export default NeedsHeader;