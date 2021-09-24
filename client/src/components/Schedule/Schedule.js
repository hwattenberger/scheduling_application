import React, { useState, useEffect } from "react";
import axios from "axios";
import dayjs from 'dayjs';
import './Schedule.css';
import ColumnContentNeeds from "./Needs/ColumnContentNeeds";
import UserAvatar from '../General/UserAvatar'
import NeedsHeader from "./Needs/NeedsHeader"

import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Fade from '@material-ui/core/Fade';
import CircularProgress from '@material-ui/core/CircularProgress';

import {Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from '@material-ui/core';
import {List, ListItem, ListItemIcon, ListItemText, Checkbox} from '@material-ui/core';


const ChooseShiftsModel = ({currentStatus, personSched, setShift, shifts}) => {
    const [open, setOpen] = useState(false);
    const [checked, setChecked] = useState([]);

    useEffect(() => {
        clearChecks();
    }, [])

    const handleToggle = (ix) => () => {
        const newChecked = [...checked]
        newChecked[ix] = !newChecked[ix]

        setChecked(newChecked);
    };

    const clearChecks = () => {
        const newChecked = [];
        let found = false;
        personSched.shiftAvail.forEach((shift, ix) => {
            found = false;
            for (let i = 0; i < personSched.scheduledShift.length; i++) {
                if(shift.shiftType === personSched.scheduledShift[i].shift) found=true;
            }
            newChecked[ix] = found;
        })
        setChecked(newChecked);
    }

    const handleClickOpen = () => {
        setOpen(true);
    };
  
    const handleClose = () => {
        clearChecks();
        setOpen(false);
    };

    const handleSave = () => {
        const updatedShifts = personSched.shiftAvail.map((shift, ix) => {
            return {
                shift: shift.shiftType,
                scheduled: checked[ix]
            }
        })
        setOpen(false);
        setShift(updatedShifts);
    };

    const labelId = (shift) => {
        return `checkbox-list-label-${shift.shiftType}`
    }

    return (
      <div>
        <Button aria-controls="fade-menu" aria-haspopup="true" onClick={handleClickOpen}>
            {currentStatus}
        </Button>
        <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">Shifts Available</DialogTitle>
            <DialogContent>
                <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                {personSched.shiftAvail.map((shift, ix) => (
                        <ListItem key={shift.shiftType} role={undefined} dense button onClick={handleToggle(ix)}>
                            <ListItemIcon>
                                <Checkbox
                                edge="start"
                                checked={checked[ix]}
                                tabIndex={-1}
                                disableRipple
                                inputProps={{ 'aria-labelledby': labelId(shift) }}
                                />
                            </ListItemIcon>
                            <ListItemText id={labelId(shift)} primary={shifts[shift.shiftType].name} />
                        </ListItem>
                ))}
                </List>
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


// const FadeMenu = ({availShifts, setShift, shifts, currentStatus}) => {
//     const [anchorEl, setAnchorEl] = React.useState(null);
//     const open = Boolean(anchorEl);
  
//     const handleClick = (event) => {
//       setAnchorEl(event.currentTarget);
//     };
  
//     const handleClose = (event) => {
//       setAnchorEl(null);
//     //   const { myValue } = event.currentTarget.dataset;
//     //   console.log(event.target.value) // --> 123
//       if (event.target.value !== undefined) {
//         setShift(event.target.value);
//       }
//     };
  
//     return (
//       <div className="availableButtonDiv">
//         <Button aria-controls="fade-menu" aria-haspopup="true" onClick={handleClick}>
//           {currentStatus}
//         </Button>
//         <Menu
//           id="fade-menu"
//           anchorEl={anchorEl}
//           keepMounted
//           open={open}
//           onClose={handleClose}
//           TransitionComponent={Fade}
//         >
//           {availShifts.map((shift, ix) => (
//             <div key={shift.shiftType}>
//               <MenuItem onClick={handleClose} value={ix}>{shifts[shift.shiftType].name}</MenuItem>
//             </div>
//           ))}
//         </Menu>
//       </div>
//     );
// }

const ColumnContentSchedule = ({columnIx, availability, staffShift, shifts}) => {
    if (!availability.length > 0) return null;
    if (columnIx === 0) return (<ScheduleHeader availability={availability}/>)
    return (<DailyStaffSchedule dayIx={columnIx-1} availability={availability} staffShift={staffShift} shifts={shifts}/>)
}


const ScheduleHeader = ({availability}) => {

    const bgColor = (personAvailability) => {
        const color = personAvailability.person.userRole.color
        return {backgroundColor: color};
    }

    return (
        <div className="dailyScheduleContainer">
            {availability[0].peopleAvailability.map((personAvailability) => (
                <div key={personAvailability.person._id} className="personDayBlock" style={bgColor(personAvailability)}>
                    <div>
                        <UserAvatar user={personAvailability.person} />
                    </div>
                    <div>
                        <div>{personAvailability.person.firstName} {personAvailability.person.lastName}</div>
                    </div>
                </div>
            ))}
        </div>
    )
}

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

const getPersonDayStatus = (personSched) => {
    if (personSched.scheduledShift.length > 1) return "Multiple"
    if (personSched.scheduledShift.length > 0) return "Scheduled"
    if (personSched.timeoff.length > 0) return "Timeoff"
    if (personSched.shiftAvail.length > 0) return "Available"
    return "Unavailable"
}

const DailySchedulePerson = ({personSched, setShift, shifts}) => {
    const status = getPersonDayStatus(personSched);

    if (status === "Multiple") return (
        <>
        <ChooseShiftsModel currentStatus="Multiple Shifts" personSched={personSched} setShift={setShift} shifts={shifts}/>
        </>
    )
    if (status === "Scheduled") return (
        <>
        <ChooseShiftsModel currentStatus={shifts[personSched.scheduledShift[0].shift].name} personSched={personSched} setShift={setShift} shifts={shifts}/>
        </>
    )
    if (status === "Available") return (
        <>
        <ChooseShiftsModel currentStatus="Available" personSched={personSched} setShift={setShift} shifts={shifts}/>
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

    const setDaySchedule = (dayIx, dayScheduleShifts) => {
        const newDayScheduleShifts = [...dayScheduleShifts]; 
        const newWeeklySchedule = {...weeklySchedule};
        const newDay = {...newWeeklySchedule.days[dayIx]}
        newDay.scheduleShifts = newDayScheduleShifts;
        newWeeklySchedule.days[dayIx] = newDay;
        setWeeklySchedule(newWeeklySchedule);
    }

    useEffect(() => {
        console.log("Reloading")
    }, [weeklySchedule]);


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
                        <NeedsHeader day={day} date={getDate(columnIx)} columnIx={columnIx} weeklySchedule={weeklySchedule} shifts={shifts} setDaySchedule={setDaySchedule} />
                        <ColumnContentNeeds columnIx={columnIx} weeklySchedule={weeklySchedule} shifts={shifts}/>
                    </div>
                ))}
            </div>


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

export default Schedule;