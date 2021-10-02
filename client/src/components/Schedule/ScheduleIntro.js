import React, {useState, useEffect} from "react"
import dayjs from 'dayjs';
import axios from "axios";
import DatePickerSchedule from "./DatePickerSchedule"
import Schedule from "./PeopleSchedule/Schedule"
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import useUnsavedUpdatesWarning from "../../hooks/useUnsavedUpdatesWarning"

import './Schedule.css';


const ScheduleIntro = () => {
    const [date, setDate] = useState(new Date());
    const [weeklySchedule, setWeeklySchedule] = useState({});
    const [noSchedule, setNoSchedule] = useState(null);
    const [updatedScheduleShifts, setUpdatedScheduleShifts] = useState([]);
    const [snackBarMsg, setSnackBarMsg] = useState(null);
    const [Prompt, setDirty, setClean] = useUnsavedUpdatesWarning();
    const baseURL = process.env.REACT_APP_API_BASE_URL;

    function formatDatetoJustDate() {
        const formattedDate = dayjs(date).format('YYYY-MM-DD');
        return formattedDate;
    }

    useEffect(() => {
        setNoSchedule(null);
        setUpdatedScheduleShifts([]);
        pullWeeklySchedule();
    }, [date]);


    function pullWeeklySchedule() {
        axios.get(`${baseURL}/scheduleWeek`, {
            withCredentials: true,
            params: {date: date}
            })
            .then(data =>  {
                setWeeklySchedule(data.data)
                if(data.data === null) setNoSchedule(true);
                else setNoSchedule(false);
            })
            .catch(e => console.log("Error Pulling Weekly Schedule", e))
    }

    function onClickCreateSchedule() {
        setNoSchedule(null);
        axios.post(`${baseURL}/scheduleWeek`, {date}, {withCredentials: true})
            .then(data => {
                setWeeklySchedule(data.data);
                if(data.data) setNoSchedule(false);
                else setNoSchedule(true);
            })
            .catch(e => console.log("Error Creating a Weekly Schedule", e.response.data))
    }

    function onClickCopySchedule() {
        setNoSchedule(null);
        axios.post(`${baseURL}/scheduleWeek/copy`, {date}, {withCredentials: true})
            .then(data => {
                setWeeklySchedule(data.data);
                if(data.data) setNoSchedule(false);
                else setNoSchedule(true);
            })
            .catch(e => {
                if (e.response.data && e.response.data.error) setSnackBarMsg(e.response.data.error)
                else setSnackBarMsg("Error creating schedule for this week")
                setNoSchedule(true);
            })
    }

    function staffShift(dayIx, person, shiftTypes) {


        const newSched = {...weeklySchedule};
        newSched.days[dayIx].scheduleShifts.forEach((scheduleShift) => {
            shiftTypes.forEach((updatedShift) => {
                if (updatedShift.shift === scheduleShift.shift) {
                    if (updatedShift.scheduled) {
                        //Add to array
                        const isInArray = isInScheduledArray(scheduleShift.peopleAssigned, person._id);
                        if(!isInArray) { 
                            scheduleShift.peopleAssigned.push(person);
                            updateUpdateShiftsArray(scheduleShift);
                        }
                    }
                    else {
                        //remove from array
                        const newSchedArray = scheduleShift.peopleAssigned.filter((scheduledPerson) => {
                            if (!scheduledPerson._id) return (scheduledPerson !== person._id)
                            else return (scheduledPerson._id !== person._id)
                        })
                        if (newSchedArray.length !== scheduleShift.peopleAssigned.length) {
                            updateUpdateShiftsArray(scheduleShift);
                            scheduleShift.peopleAssigned = newSchedArray;
                        }
                    }
                }
            })
        })
        setWeeklySchedule(newSched);
    }

    function updateUpdateShiftsArray(scheduleShift) {
        let isFound = false;
        const newUpdatedScheduleShifts = [...updatedScheduleShifts]
        newUpdatedScheduleShifts.forEach((scheduledShift) => {
            if(scheduledShift.shift === scheduleShift.shift && scheduleShift.date === scheduledShift.date) {
                scheduledShift = scheduleShift;
                isFound = true;
            }
        })

        if (isFound) setUpdatedScheduleShifts([...newUpdatedScheduleShifts]);
        else setUpdatedScheduleShifts([...newUpdatedScheduleShifts, scheduleShift]);
        setDirty();
    }

    function isInScheduledArray(peopleAssigned, personId) {
        let isInArray = false;
        peopleAssigned.forEach((person) => {
            if (person._id === personId) {
                isInArray = true;
                return isInArray;
            }
        })

        return isInArray;
    }

    function handleSnackClose() {
        setSnackBarMsg(null);
    }

    function saveSchedule() {
        updatedScheduleShifts.forEach((scheduleShift) => {
            axios.put(`${baseURL}/scheduleShift/${scheduleShift._id}`, scheduleShift, { withCredentials: true})
            .then(result => {
                setSnackBarMsg("Saved");
                setUpdatedScheduleShifts([]);
                setClean();
            })
        })
    }

    return (
        <div>
            <h1 className="scheduleH1">Schedule</h1>
            <div id="scheduleDatePicker">
                <DatePickerSchedule date={formatDatetoJustDate()} setDate={setDate}/>
                <div>
                    {noSchedule === true && <Button variant="outlined" color="primary" className="schedulebtn" onClick={onClickCopySchedule}>Copy Schedule From Last Week</Button>}
                    {noSchedule === true && <Button variant="outlined" className="schedulebtn" onClick={onClickCreateSchedule}>Create New Blank Schedule</Button>}
                </div>
            </div>
            {noSchedule === false && <Schedule weeklySchedule={weeklySchedule} date={date} staffShift={staffShift} setWeeklySchedule={setWeeklySchedule}/>}
            {updatedScheduleShifts.length > 0 && <Button id="saveChgBtn" variant="outlined" onClick={saveSchedule}>Save Changes</Button>}
            <Snackbar
                anchorOrigin={{vertical: 'top', horizontal: 'center'}}
                open={(snackBarMsg ? true: false)}
                onClose={handleSnackClose}
                message={snackBarMsg}
                key={'top' + 'center'} />
            {Prompt}
        </div>
    )
}

export default ScheduleIntro;