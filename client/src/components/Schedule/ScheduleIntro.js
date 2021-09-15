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

    function staffShift(dayIx, person, shiftType) {
        const newSched = {...weeklySchedule};
        newSched.days[dayIx].scheduleShifts.forEach((scheduleShift) => {
            console.log("For Each", shiftType, scheduleShift.shift)
            if (shiftType === scheduleShift.shift) {
                scheduleShift.peopleAssigned.push(person);
                setUpdatedScheduleShifts([...updatedScheduleShifts, scheduleShift]);
            }
        })
        console.log("New Schedule", newSched);
        setWeeklySchedule(newSched);
    }

    function saveSchedule() {
        console.log("Safe", updatedScheduleShifts)
        updatedScheduleShifts.forEach((scheduleShift) => {
            axios.put(`http://localhost:5000/scheduleShift/${scheduleShift._id}`, {
                withCredentials: true,
                body: scheduleShift
            })
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
            {noSchedule === false && <Schedule weeklySchedule={weeklySchedule} date={date} staffShift={staffShift}/>}
            {updatedScheduleShifts.length > 0 && <button onClick={saveSchedule}>Save Changes</button>}
        </div>
    )
}

export default ScheduleIntro;