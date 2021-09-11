import React, {useState, useEffect} from "react"
import {useParams} from "react-router-dom";
import dayjs from 'dayjs';
import axios from "axios";


const UserScheduledShifts = () => {
    const { staffId } = useParams();
    const [userSchedule, setUserSchedule] = useState([]);

    useEffect(() => {
        pullWeeklySchedule();
    }, []);

    function pullWeeklySchedule() {
        axios.get(`http://localhost:5000/staff/${staffId}/upcomingShifts`, {
            withCredentials: true
            })
            .then(data =>  {
                console.log("My Schedule", data.data);
                setUserSchedule(data.data);
            })
            .catch(e => console.log("Error Pulling Weekly Schedule", e))
    }

    return (
        <div>
            <h2>My Shifts</h2>
            {userSchedule.map((oneSched) => (
                <div key={oneSched._id}>{oneSched.date} - {oneSched.shift.name}</div>
            ))}
        </div>
    )
}

export default UserScheduledShifts;