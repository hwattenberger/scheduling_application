import ScheduleHeader from "./ScheduleHeader";
import DailyStaffSchedule from "./DailyStaffSchedule";

const ColumnContentSchedule = ({columnIx, availability, staffShift, shifts}) => {
    if (!availability.length > 0) return null;
    if (columnIx === 0) return (<ScheduleHeader availability={availability}/>)
    return (<DailyStaffSchedule dayIx={columnIx-1} availability={availability} staffShift={staffShift} shifts={shifts}/>)
}

export default ColumnContentSchedule;