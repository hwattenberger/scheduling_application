import ChooseShiftsModal from "./ChooseShiftsModal";
import {getPersonDayStatus} from "../../../helpfulFunctions/index"

const DailySchedulePerson = ({personSched, setShift, shifts}) => {
    const status = getPersonDayStatus(personSched);

    if (status === "Multiple") return (
        <>
        <ChooseShiftsModal currentStatus="Multiple Shifts" personSched={personSched} setShift={setShift} shifts={shifts}/>
        </>
    )
    if (status === "Scheduled") return (
        <>
        <ChooseShiftsModal currentStatus={shifts[personSched.scheduledShift[0].shift].name} personSched={personSched} setShift={setShift} shifts={shifts}/>
        </>
    )
    if (status === "Available") return (
        <>
        <ChooseShiftsModal currentStatus="Available" personSched={personSched} setShift={setShift} shifts={shifts}/>
        </>
    )
    if (status === "Timeoff") return (
        <>
        Timeoff Request
        </>
    )
    return (
        <>
        Unavailable
        </>
    );
}

export default DailySchedulePerson;