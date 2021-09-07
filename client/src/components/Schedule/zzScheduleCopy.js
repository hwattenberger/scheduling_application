import React, { useState, useEffect } from "react";
import axios from "axios";
import './Schedule.css';
import ColumnContentNeeds from "./ColumnContentNeeds";

import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Fade from '@material-ui/core/Fade';

const FadeMenu = ({availShifts, setShift}) => {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
  
    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };
  
    const handleClose = (event) => {
      setAnchorEl(null);
      const { myValue } = event.currentTarget.dataset;
      console.log(event.target.value) // --> 123
      setShift(event.target.value)
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
            <div key={shift.shiftType._id}>
              <MenuItem onClick={handleClose} value={ix}>{shift.shiftType.name}</MenuItem>
            </div>
          ))}
        </Menu>
      </div>
    );
}

const ColumnContent = ({columnIx, availability}) => {
    if (columnIx === 0) return (<ScheduleHeader availability={availability}/>)
    return (<DailyStaffSchedule dayIx={columnIx-1} availability={availability}/>)
}

const ScheduleHeader = ({availability}) => {
    return (
        <div className="dailyScheduleContainer">
            {availability.map((personAvailability) => (
                <div key={personAvailability.person._id} className="personDayBlock">
                    <div>{personAvailability.person.firstName} {personAvailability.person.lastName}</div>
                    {/* <div>{personAvailability.person.userRole.name}</div> */}
                </div>
            ))}
        </div>
    )
}

const DailyStaffSchedule = ({dayIx, availability}) => {
    const [daySchedule, setDaySchedule] = useState([]);

    useEffect(() => {
        const newAvailability = availability.map((availPerson) => {
            const AvailShifts = availPerson.weekAvailability[dayIx].shiftAvailability.filter(shift => shift.available === true)
            const tempPerson = {
                person: availPerson.person,
                shiftAvail: AvailShifts
            }
            return tempPerson;
        })
        setDaySchedule(newAvailability);
    }, [availability]);

    const setShift = (availShiftIx, personIx) => {
        const newSchedule = [...daySchedule];
        const shift = newSchedule[personIx].shiftAvail[availShiftIx];
        newSchedule[personIx].scheduledShift = shift;
        setDaySchedule(newSchedule);
        console.log("Hi", availShiftIx, personIx)
    }

    function getPersonDayClassName(personSched) {
        let returnClass = "personDayBlock"
        const personDayStatus = getPersonDayStatus(personSched);
        returnClass = returnClass + " " + personDayStatus

        return returnClass;
    }


    return (
        <div className="dailyScheduleContainer">
            {/* {console.log("Daily Schedule", daySchedule)} */}
            {daySchedule.map((personSched, personIx) => (
                <div key={personSched.person._id} className={getPersonDayClassName(personSched)}>
                    <DailySchedulePerson personSched={personSched} setShift={(availShiftIx) => setShift(availShiftIx,personIx)} />
                </div>
            ))}
        </div>
    )

}

const getPersonDayStatus = (personSched) => {
    if (personSched.scheduledShift) return "Scheduled"
    if (personSched.shiftAvail.length > 0) return "Available"
    return "Unavailable"
}

const DailySchedulePerson = ({personSched, setShift}) => {
    const status = getPersonDayStatus(personSched);

    if (status === "Scheduled") return (
        <>
        {personSched.scheduledShift.shiftType.name}
        </>
    )
    if (status === "Available") return (
        <>
        < FadeMenu availShifts={personSched.shiftAvail} setShift={setShift}/>
        </>
    )
    return (
        <>
        Unavailable
        </>
    );
}

const Schedule = ({weeklySchedule}) => {
    const week = [".", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    const [shifts, setShifts] = useState([]);
    // const [roles, getRoles] = useState({});
    const [schedule, setSchedule] = useState([]);
    const [availability, setWeeklyAvailability] = useState([]);
    // const [firstDayOfWeek, getFirstDayOfWeek] = useState();
    const [date, setDate] = useState();

    useEffect(() => {
        pullShifts();
        pullWeeklyAvailability();
        pullSchedule();
    }, []);

    useEffect(() => {
        console.log("Schedule Use Effect", schedule)
        if (schedule.length === 0 && shifts.length > 0) {
            setupNewWeekSchedule();
        }
    }, [shifts]);

    //Do this after pulling shifts
    function setupNewWeekSchedule() {
        const tempShiftObjectMap = {};

        const shiftsArray = [];
        shifts.forEach((shift) => {
            const shiftRole = shift.role._id;
            if (tempShiftObjectMap[shiftRole] === undefined) {
                tempShiftObjectMap[shiftRole] = shiftsArray.length;
                shiftsArray.push({
                    role: shift.role,
                    shifts: [{
                        shift: shift,
                        peopleAssigned: [],
                        peopleNeeded: shift.defNum
                    }]
                });
            } else {
                const arrIx = tempShiftObjectMap[shiftRole]
                shiftsArray[arrIx].shifts.push({
                    shift: shift,
                    peopleAssigned: [],
                    peopleNeeded: shift.defNum
                })
            }

        })

        const tempSchedule = new Array(7).fill().map((day, ix) => {
            let dayDate = new Date(date);
            dayDate.setDate(date.getDate() + ix);

            const dayInfo = {
                date: dayDate,
                shiftsByRole: [...shiftsArray]
            };
            return dayInfo;
        })

        console.log("Temp Sched", tempSchedule)

        setSchedule(tempSchedule);
    }

    function pullSchedule() {
        axios.get('http://localhost:5000/scheduleShifts', {
            withCredentials: true,
            params: {date: date}
            })
            .then(data =>  {
                // setShifts([...data.data])
                console.log("Data", data.data)
                // console.log("Schedule", schedule)
            })
            .catch(e => console.log("Error Pulling Schedule", e))
    }

    function pullShifts() {
        axios.get('http://localhost:5000/shifts', {withCredentials: true})
            .then(data =>  {
                setShifts([...data.data])
                console.log("Shifts", data.data)
                console.log("Schedule", schedule)
            })
            .catch(e => console.log("Error Staff", e))
    }

    function pullWeeklyAvailability() {
        axios.get('http://localhost:5000/staffAvailability', {withCredentials: true})
            .then(data => { setWeeklyAvailability(data.data);
                console.log("Availability", data.data)})
            .catch(e => console.log("Error Staff", e))
    }

    
    return (
        <div id="mainSchedule">
            <h2>Needs</h2>
            <div id="needsDiv">
                {week.map((day, columnIx) => (
                    <div key={columnIx} className="weekday-div">
                        <span className="dayName">{day}</span>
                        <ColumnContentNeeds columnIx={columnIx} schedule={schedule}/>
                    </div>
                ))}
            </div>


            <h2>Schedule</h2>
            <div id="mainWeekDiv">
                {week.map((day, columnIx) => (
                    <div key={columnIx} className="weekday-div">
                        <span className="dayName">{day}</span>
                        <ColumnContent columnIx={columnIx} availability={availability}/>
                    </div>
                ))}
            </div>
        </div>
    )
}

const ScheduleOld = (props) => {
    const week = ["Staff", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    const [shifts, setShifts] = useState([]);
    // const [roles, getRoles] = useState({});
    const [schedule, setSchedule] = useState([]);
    const [availability, setWeeklyAvailability] = useState([]);
    // const [firstDayOfWeek, getFirstDayOfWeek] = useState();
    const [date, setDate] = useState();

    useEffect(() => {
        pullShifts();
        pullWeeklyAvailability();
        pullSchedule();
    }, []);

    useEffect(() => {
        console.log("Schedule Use Effect", schedule)
        if (schedule.length === 0 && shifts.length > 0) {
            setupNewWeekSchedule();
        }
    }, [shifts]);

    //Do this after pulling shifts
    function setupNewWeekSchedule() {
        const tempShiftObjectMap = {};

        const shiftsArray = [];
        shifts.forEach((shift) => {
            const shiftRole = shift.role._id;
            if (tempShiftObjectMap[shiftRole] === undefined) {
                tempShiftObjectMap[shiftRole] = shiftsArray.length;
                shiftsArray.push({
                    role: shift.role,
                    shifts: [{
                        shift: shift,
                        peopleAssigned: [],
                        peopleNeeded: shift.defNum
                    }]
                });
            } else {
                const arrIx = tempShiftObjectMap[shiftRole]
                shiftsArray[arrIx].shifts.push({
                    shift: shift,
                    peopleAssigned: [],
                    peopleNeeded: shift.defNum
                })
            }

        })

        const tempSchedule = new Array(7).fill().map((day, ix) => {
            let dayDate = new Date(date);
            dayDate.setDate(date.getDate() + ix);

            const dayInfo = {
                date: dayDate,
                shiftsByRole: [...shiftsArray]
            };
            return dayInfo;
        })

        console.log("Temp Sched", tempSchedule)

        setSchedule(tempSchedule);
    }

    function pullSchedule() {
        axios.get('http://localhost:5000/scheduleShifts', {
            withCredentials: true,
            params: {date: date}
            })
            .then(data =>  {
                // setShifts([...data.data])
                console.log("Data", data.data)
                // console.log("Schedule", schedule)
            })
            .catch(e => console.log("Error Pulling Schedule", e))
    }

    function pullShifts() {
        axios.get('http://localhost:5000/shifts', {withCredentials: true})
            .then(data =>  {
                setShifts([...data.data])
                console.log("Shifts", data.data)
                console.log("Schedule", schedule)
            })
            .catch(e => console.log("Error Staff", e))
    }

    function pullWeeklyAvailability() {
        axios.get('http://localhost:5000/staffAvailability', {withCredentials: true})
            .then(data => { setWeeklyAvailability(data.data);
                console.log("Availability", data.data)})
            .catch(e => console.log("Error Staff", e))
    }

    
    return (
        <div id="mainSchedule">
            <h2>Needs</h2>
            <div id="needsDiv">
                {week.map((day, columnIx) => (
                    <div key={columnIx} className="weekday-div">
                        <span className="dayName">{day}</span>
                        <ColumnContentNeeds columnIx={columnIx} schedule={schedule}/>
                    </div>
                ))}
            </div>


            <h2>Schedule</h2>
            <div id="mainWeekDiv">
                {week.map((day, columnIx) => (
                    <div key={columnIx} className="weekday-div">
                        <span className="dayName">{day}</span>
                        <ColumnContent columnIx={columnIx} availability={availability}/>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Schedule;