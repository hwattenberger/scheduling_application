import React, { useState, useEffect } from "react";
import DailySchedulePerson from "./DailySchedulePerson";
import {getPersonDayStatus} from "../../../helpfulFunctions/index"

const DailyStaffSchedule = ({dayIx, availability, staffShift, shifts}) => {
    const [daySchedule, setDaySchedule] = useState([]);

    useEffect(() => {
        const newAvailability = availability[dayIx].peopleAvailability.map((availPerson) => {
            const AvailShifts = availPerson.shiftAvailability.filter(shift => shift.isAvailable === true)
            const tempPerson = {
                person: availPerson.person,
                shiftAvail: AvailShifts,
                timeoff: availPerson.timeoff,
                scheduledShift: availPerson.scheduledShift
            }
            return tempPerson;
        })
        setDaySchedule(newAvailability);
    }, [availability]);

    const setShift = (scheduledShifts, personIx) => {
        const newSchedule = [...daySchedule];
        newSchedule[personIx].scheduledShift = scheduledShifts.filter((shift) => shift.scheduled);
        setDaySchedule(newSchedule);

        const person = newSchedule[personIx].person;

        staffShift(dayIx, person, scheduledShifts);
    }

    function getPersonDayClassName(personSched) {
        let returnClass = "personDayBlock"
        const personDayStatus = getPersonDayStatus(personSched);
        returnClass = returnClass + " " + personDayStatus

        return returnClass;
    }


    return (
        <div className="dailyScheduleContainer">
            {console.log("Daily Schedule", daySchedule)}
            {daySchedule.map((personSched, personIx) => (
                <div key={personSched.person._id} className={getPersonDayClassName(personSched)}>
                    <DailySchedulePerson personSched={personSched} shifts={shifts} setShift={(availShiftIx) => setShift(availShiftIx,personIx)} />
                </div>
            ))}
        </div>
    )

}

export default DailyStaffSchedule;