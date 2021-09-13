import React, { useState, useEffect } from "react";
import axios from "axios";
import dayjs from 'dayjs';
import './Schedule.css';
import ColumnContentNeeds from "./ColumnContentNeeds";

import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Fade from '@material-ui/core/Fade';

const FadeMenu = ({availShifts, setShift, shifts}) => {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
  
    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };
  
    const handleClose = (event) => {
      setAnchorEl(null);
      const { myValue } = event.currentTarget.dataset;
      console.log(event.target.value) // --> 123
      if (event.target.value !== undefined) {
        setShift(event.target.value);
      }
    };
  
    return (
      <div className="availableButtonDiv">
        <Button aria-controls="fade-menu" aria-haspopup="true" onClick={handleClick}>
          Available
        </Button>
        <Menu
          id="fade-menu"
          anchorEl={anchorEl}
          keepMounted
          open={open}
          onClose={handleClose}
          TransitionComponent={Fade}
        >
          {availShifts.map((shift, ix) => (
            <div key={shift.shiftType}>
              <MenuItem onClick={handleClose} value={ix}>{shifts[shift.shiftType].name}</MenuItem>
            </div>
          ))}
        </Menu>
      </div>
    );
}

const ColumnContentSchedule = ({columnIx, availability, staffShift, shifts}) => {
    if (!availability.length > 0) return null;
    if (columnIx === 0) return (<ScheduleHeader availability={availability}/>)
    // return null;
    return (<DailyStaffSchedule dayIx={columnIx-1} availability={availability} staffShift={staffShift} shifts={shifts}/>)
}


const ScheduleHeader = ({availability}) => {

    const bgColor = (personAvailability) => {
        const color = personAvailability.person.userRole.color
        return {backgroundColor: color};
    }

    return (
        <div className="dailyScheduleContainer">
            {/* {console.log("Availability1", availability)} */}
            {availability[0].peopleAvailability.map((personAvailability) => (
                <div key={personAvailability.person._id} className="personDayBlock" style={bgColor(personAvailability)}>
                {/* {console.log("personAvailability", personAvailability)} */}
                    <div>{personAvailability.person.firstName} {personAvailability.person.lastName}</div>
                    <div>{personAvailability.person.userRole.name}</div>
                </div>
            ))}
        </div>
    )

    // return (
    //     <div className="dailyScheduleContainer">
    //         {availability.map((personAvailability) => (
    //             <div key={personAvailability.person._id} className="personDayBlock" style={bgColor(personAvailability)}>
    //                 <div>{personAvailability.person.firstName} {personAvailability.person.lastName}</div>
    //                 {/* <div>{personAvailability.person.userRole.name}</div> */}
    //             </div>
    //         ))}
    //     </div>
    // )
}

const DailyStaffSchedule = ({dayIx, availability, staffShift, shifts}) => {
    const [daySchedule, setDaySchedule] = useState([]);

    useEffect(() => {
        // console.log("Top Availability", availability)
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
        // console.log("Top Availability Set Day", newAvailability)
    }, [availability]);

    const setShift = (availShiftIx, personIx) => {
        const newSchedule = [...daySchedule];
        const shift = newSchedule[personIx].shiftAvail[availShiftIx];
        newSchedule[personIx].scheduledShift[0] = {
            shift: shift.shiftType
        }
        setDaySchedule(newSchedule);
        console.log("Hi", daySchedule)
        console.log("Person", newSchedule[personIx].person)
        console.log("Shift Type", shift.shiftType)
        const person = newSchedule[personIx].person;
        const shiftTypeId = shift.shiftType;

        staffShift(dayIx, person, shiftTypeId);
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

const getPersonDayStatus = (personSched) => {
    if (personSched.scheduledShift.length > 0) return "Scheduled"
    if (personSched.timeoff.length > 0) return "Timeoff"
    if (personSched.shiftAvail.length > 0) return "Available"
    return "Unavailable"
}

const DailySchedulePerson = ({personSched, setShift, shifts}) => {
    const status = getPersonDayStatus(personSched);

    if (status === "Scheduled") return (
        <>
        { shifts[personSched.scheduledShift[0].shift].name}
        </>
    )
    if (status === "Available") return (
        <>
        <FadeMenu availShifts={personSched.shiftAvail} setShift={setShift} shifts={shifts}/>
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

const Schedule = ({weeklySchedule, date, staffShift}) => {
    const week = [".", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const [shifts, setShifts] = useState(null);
    const [availability, setWeeklyAvailability] = useState([]);
    // const [date, setDate] = useState();

    useEffect(() => {
        pullShifts();
        pullWeeklyAvailability();
    }, [date]);

    // useEffect(() => {
    //     console.log("Schedule Use Effect", schedule)
    //     if (schedule.length === 0 && shifts.length > 0) {
    //         setupNewWeekSchedule();
    //     }
    // }, [shifts]);

    function pullShifts() {
        axios.get('http://localhost:5000/shifts', { withCredentials: true })
            .then(data =>  {
                const tempShifts = data.data;
                const tempShiftObj = {};
                tempShifts.forEach((shift) => {
                    tempShiftObj[shift._id] = shift;
                })
                setShifts(tempShiftObj)
                console.log("Shifts", shifts)
            })
            .catch(e => console.log("Error Staff", e))
    }

    function pullWeeklyAvailability() {
        axios.get('http://localhost:5000/staffAvailabilityDate', {
            withCredentials: true,
            params: {date: weeklySchedule.firstDayOfWeek}
            })
            .then(data => { 
                setWeeklyAvailability(data.data);
                console.log("Availability", data.data)
            })
            .catch(e => console.log("Error pulling availability", e))
    }

    function dayName(columnIx) {
        if (columnIx===0) return "";
        return `${week[columnIx]} - ${getDate(columnIx)}`;
    }

    function getDate(columnIx) {
        return dayjs(weeklySchedule.firstDayOfWeek).add(columnIx-1,'day').format("MM/DD")
    }

    if( !availability.length>0 || shifts === null) return ("Loading");
    
    return (
        <div id="mainSchedule">
            <h2>Needs</h2>
            <div id="needsDiv">
                {week.map((day, columnIx) => (
                    <div key={columnIx} className="weekday-div">
                        <span className="dayName">{day}</span>
                        <ColumnContentNeeds columnIx={columnIx} weeklySchedule={weeklySchedule} shifts={shifts}/>
                    </div>
                ))}
            </div>


            <h2>Schedule</h2>
            <div id="mainWeekDiv">
                {week.map((day, columnIx) => (
                    <div key={columnIx} className="weekday-div">
                        <span className="dayName">{dayName(columnIx)}</span>
                        <ColumnContentSchedule columnIx={columnIx} availability={availability} staffShift={staffShift} shifts={shifts}/>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Schedule;