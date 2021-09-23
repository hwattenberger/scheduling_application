import React, { useState, useEffect } from "react";
import axios from "axios";
import dayjs from 'dayjs';
import './Schedule.css';
import ColumnContentNeeds from "./ColumnContentNeeds";
import UserAvatar from '../General/UserAvatar'

import NumericInput from 'react-numeric-input';

import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Fade from '@material-ui/core/Fade';
import CircularProgress from '@material-ui/core/CircularProgress';

// import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';


const FadeMenu = ({availShifts, setShift, shifts, currentStatus}) => {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
  
    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };
  
    const handleClose = (event) => {
      setAnchorEl(null);
    //   const { myValue } = event.currentTarget.dataset;
    //   console.log(event.target.value) // --> 123
      if (event.target.value !== undefined) {
        setShift(event.target.value);
      }
    };
  
    return (
      <div className="availableButtonDiv">
        <Button aria-controls="fade-menu" aria-haspopup="true" onClick={handleClick}>
          {currentStatus}
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
                    <div>
                        <UserAvatar user={personAvailability.person} />
                    </div>
                    <div>
                        <div>{personAvailability.person.firstName} {personAvailability.person.lastName}</div>
                        {/* <div>{personAvailability.person.userRole.name}</div> */}
                    </div>
                </div>
            ))}
        </div>
    )
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
        <FadeMenu availShifts={personSched.shiftAvail} setShift={setShift} shifts={shifts} currentStatus={shifts[personSched.scheduledShift[0].shift].name}/>
        </>
    )
    if (status === "Available") return (
        <>
        <FadeMenu availShifts={personSched.shiftAvail} setShift={setShift} shifts={shifts} currentStatus="Available"/>
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

const Schedule = ({weeklySchedule, date, staffShift, setWeeklySchedule}) => {
    const week = [".", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const [shifts, setShifts] = useState(null);
    const [availability, setWeeklyAvailability] = useState([]);
    const [gotInfo, setGotInfo] = useState(0);
    // const [date, setDate] = useState();

    useEffect(() => {
        let isMounted = true;
        let tempGotInfo = 0;
        pullShifts();
        pullWeeklyAvailability();
        return () => {
            isMounted = false;
        };

        function pullShifts() {
            axios.get('http://localhost:5000/shiftTypes', { withCredentials: true })
                .then(data =>  {
                    const tempShifts = data.data;
                    const tempShiftObj = {};
                    tempShifts.forEach((shift) => {
                        tempShiftObj[shift._id] = shift;
                    })
                    if (isMounted) setShifts(tempShiftObj)
                    tempGotInfo++;
                    if (isMounted) setGotInfo(tempGotInfo);
                    console.log("ShiftsHere", tempShiftObj)
                })
                .catch(e => console.log("Error Staff", e))
        }
    
        function pullWeeklyAvailability() {
            axios.get('http://localhost:5000/staffAvailabilityDate', {
                withCredentials: true,
                params: {date: weeklySchedule.firstDayOfWeek}
                })
                .then(data => { 
                    if (isMounted) setWeeklyAvailability(data.data);
                    tempGotInfo++;
                    if (isMounted) setGotInfo(tempGotInfo);
                    console.log("Availability", data.data)
                })
                .catch(e => console.log("Error pulling availability", e))
        }
    }, [date]);

    useEffect(() => {
        console.log("Reloading")
    }, [weeklySchedule]);

    // useEffect(() => {
    //     console.log("Schedule Use Effect", schedule)
    //     if (schedule.length === 0 && shifts.length > 0) {
    //         setupNewWeekSchedule();
    //     }
    // }, [shifts]);


    function dayName(columnIx) {
        if (columnIx===0) return <div className="dateSection"></div>;
        return (
            <div className="dateSection">
                <span className="dayName">{week[columnIx]} </span>
                {getDate(columnIx)}
            </div>)
    }

    function getDate(columnIx) {
        return dayjs(weeklySchedule.firstDayOfWeek).add(columnIx-1,'day').format("MM/DD")
    }

    if( gotInfo < 2 ) return <CircularProgress />;
    
    return (
        <div id="mainSchedule">
            <h2>Needs</h2>
            <div id="needsDiv">
                {week.map((day, columnIx) => (
                    <div key={columnIx} className="weekday-div">
                        <NeedsDayHeader day={day} date={getDate(columnIx-1)} dayIx={columnIx-1} weeklySchedule={weeklySchedule} shifts={shifts} setWeeklySchedule={setWeeklySchedule} />
                        <ColumnContentNeeds columnIx={columnIx} weeklySchedule={weeklySchedule} shifts={shifts}/>
                    </div>
                ))}
            </div>
            {/* <EditDailyNeeds dayIx="2" weeklySchedule={weeklySchedule} shifts={shifts} /> */}


            <h2>Schedule</h2>
            <div id="mainWeekDiv">
                {week.map((day, columnIx) => (
                    <div key={columnIx} className="weekday-div">
                        {dayName(columnIx)}
                        <ColumnContentSchedule columnIx={columnIx} availability={availability} staffShift={staffShift} shifts={shifts}/>
                    </div>
                ))}
            </div>
        </div>
    )
}

const NeedsDayHeader = ({day, date, dayIx, weeklySchedule, shifts, setWeeklySchedule}) => {
    const [open, setOpen] = useState(false);
    const [dayScheduleShifts, setDayScheduleShifts] = useState([]);

    useEffect(() => {
        if(dayIx >= 0) {
            const dayScheduleShifts = weeklySchedule.days[dayIx].scheduleShifts.map((shift) => shift)
            setDayScheduleShifts([...dayScheduleShifts])
        }
    }, [])
  
    const handleClickOpen = () => {
        setOpen(true);
    };
  
    const handleClose = () => {
        setOpen(false);
        const dayScheduleShifts = weeklySchedule.days[dayIx].scheduleShifts.map((shift) => shift)
        setDayScheduleShifts([...dayScheduleShifts])
    };

    const handleSave = () => {
        setOpen(false);
        console.log("weeklySchedule", weeklySchedule)
        const newWeeklySchedule = {...weeklySchedule};
        newWeeklySchedule.days[dayIx].scheduleShifts = [...dayScheduleShifts]
        setWeeklySchedule(newWeeklySchedule);
    };

    const onChange = (shiftIx, e) => {
        const newScheduleShift = [...dayScheduleShifts];
        newScheduleShift[shiftIx].peopleNeeded = e;
        setDayScheduleShifts(newScheduleShift);
        // console.log("Test", newScheduleShift)
    }
    
    if(dayIx < 0) return null;
    if(!dayScheduleShifts.length > 0) return null;
  
    return (
      <div>
        <span className="dayName" onClick={handleClickOpen}>{day}</span>
        <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
          <DialogTitle id="form-dialog-title">Change Staff Needed for {day}, {date}</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Update the number of people you want to work for each shift
            </DialogContentText>
            {dayScheduleShifts.map((scheduleShift, shiftIx) => (
                <div key={scheduleShift._id}>
                    {shifts[scheduleShift.shift] && shifts[scheduleShift.shift].name} - 
                    {shifts[scheduleShift.shift].role.name}
                    <NumericInput name="defNum" className="inputField" label="Defalt Number" onChange={(e) => onChange(shiftIx, e)}
                        value={scheduleShift.peopleNeeded} min={0} max={100}/>
                </div>
            ))}
            {/* <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Email Address"
              type="email"
              fullWidth
            /> */}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Cancel
            </Button>
            <Button onClick={handleSave} color="primary">
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }

export default Schedule;