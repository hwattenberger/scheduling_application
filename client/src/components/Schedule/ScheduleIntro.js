import React, {useState, useEffect} from "react"
import dayjs from 'dayjs';
import axios from "axios";
import DatePickerSchedule from "./DatePickerSchedule"
import Schedule from "./Schedule"
import Button from '@material-ui/core/Button';
import './Schedule.css';


const ScheduleIntro = (props) => {
    const [date, setDate] = useState(new Date());
    const [weeklySchedule, setWeeklySchedule] = useState({});
    const [noSchedule, setNoSchedule] = useState(null);
    const [updatedScheduleShifts, setUpdatedScheduleShifts] = useState([]);

    function formatDatetoJustDate() {
        const formattedDate = dayjs(date).format('YYYY-MM-DD');
        return formattedDate;
    }

    useEffect(() => {
        setNoSchedule(null);
        pullWeeklySchedule();
    }, [date]);

    useEffect(() => {
        console.log("ScheduleIntroTest")
    }, [weeklySchedule]);

    function pullWeeklySchedule() {
        axios.get('http://localhost:5000/scheduleWeek', {
            withCredentials: true,
            params: {date: date}
            })
            .then(data =>  {
                setWeeklySchedule(data.data)
                if(data.data === null) setNoSchedule(true);
                else setNoSchedule(false);
                console.log("Weekly Schedule", data.data)
                // console.log("Schedule", schedule)
            })
            .catch(e => console.log("Error Pulling Weekly Schedule", e))
    }

    function onClickCreateSchedule() {
        setNoSchedule(null);
        axios.post(`http://localhost:5000/scheduleWeek`, {
            withCredentials: true,
            body: {date}
        })
            .then(data => {
                console.log("Did it work to create a schedule?", data.data);
                setWeeklySchedule(data.data);
                if(data.data) setNoSchedule(false);
                else setNoSchedule(true);
            })
            .catch(e => console.log("Error Creating a Weekly Schedule", e))
    }

    function staffShift(dayIx, person, shiftTypes) {


        const newSched = {...weeklySchedule};
        newSched.days[dayIx].scheduleShifts.forEach((scheduleShift) => {
            shiftTypes.forEach((updatedShift) => {
                if (updatedShift.shift === scheduleShift.shift) {
                    if (updatedShift.scheduled) {
                        //Add to array
                        const isInArray = isInScheduledArray(scheduleShift.peopleAssigned, person._id);
                        console.log("Yes?AA", isInArray, scheduleShift, person)
                        if(!isInArray) { 
                            scheduleShift.peopleAssigned.push(person);
                            // console.log("Not scheduled, adding", scheduleShift)
                            updateUpdateShiftsArray(scheduleShift);
                        }
                    }
                    else {
                        //remove from array
                        const newSchedArray = scheduleShift.peopleAssigned.filter((scheduledPerson) => {
                            if (!scheduledPerson._id) return (scheduledPerson !== person._id)
                            else return (scheduledPerson._id !== person._id)
                        })
                        console.log("Get here?", newSchedArray)
                        if (newSchedArray.length !== scheduleShift.peopleAssigned.length) {
                            updateUpdateShiftsArray(scheduleShift);
                            scheduleShift.peopleAssigned = newSchedArray;
                            console.log("Scheduled, removing", scheduleShift)
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
            if(scheduledShift.shift === scheduleShift.shift) {
                scheduledShift = scheduleShift;
                isFound = true;
            }
        })
        console.log("Found?", isFound, newUpdatedScheduleShifts)
        if (isFound) setUpdatedScheduleShifts([...newUpdatedScheduleShifts]);
        else setUpdatedScheduleShifts([...newUpdatedScheduleShifts, scheduleShift]);
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

    function saveSchedule() {
        console.log("Safe", updatedScheduleShifts)
        updatedScheduleShifts.forEach((scheduleShift) => {
            axios.put(`http://localhost:5000/scheduleShift/${scheduleShift._id}`, scheduleShift, { withCredentials: true})
            .then(result => {
                console.log("Saved successfully");
                setUpdatedScheduleShifts([]);
            })
        })
    }

    return (
        <div>
            <h1 className="scheduleH1">Schedule</h1>
            <div id="scheduleDatePicker">
                <DatePickerSchedule date={formatDatetoJustDate()} setDate={setDate}/>
                {noSchedule === true && <Button variant="outlined" className="schedulebtn" onClick={onClickCreateSchedule}>Create Schedule</Button>}
            </div>
            {noSchedule === false && <Schedule weeklySchedule={weeklySchedule} date={date} staffShift={staffShift} setWeeklySchedule={setWeeklySchedule}/>}
            {updatedScheduleShifts.length > 0 && <button onClick={saveSchedule}>Save Changes</button>}
        </div>
    )
}

export default ScheduleIntro;