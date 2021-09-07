import React, {useState, useEffect} from "react"
import dayjs from 'dayjs';
import axios from "axios";
import DatePickerSchedule from "./DatePickerSchedule"
import Schedule from "./Schedule"
import './Schedule.css';


const ScheduleIntro = (props) => {
    const [date, setDate] = useState(new Date());
    const [weeklySchedule, setWeeklySchedule] = useState({});
    const [noSchedule, setNoSchedule] = useState(null);

    function formatDatetoJustDate() {
        const formattedDate = dayjs(date).format('YYYY-MM-DD');
        return formattedDate;
    }

    useEffect(() => {
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

    return (
        <div>
            <h1 className="scheduleH1">Schedule</h1>
            <div id="scheduleDatePicker">
                <DatePickerSchedule date={formatDatetoJustDate()} setDate={setDate}/>
                {noSchedule === true && <button onClick={onClickCreateSchedule}>Create Schedule</button>}
            </div>
            {noSchedule === false && <Schedule weeklySchedule={weeklySchedule} date={date}/>}
        </div>
    )
}

export default ScheduleIntro;