import React, {useState, useEffect} from "react"
import {useParams} from "react-router-dom";
import axios from "axios";


const UserScheduledShifts = () => {
    const { staffId } = useParams();
    const [userSchedule, setUserSchedule] = useState([]);
    const baseURL = process.env.REACT_APP_API_BASE_URL;

    useEffect(() => {
        pullWeeklySchedule();
    }, []);

    function pullWeeklySchedule() {
        axios.get(`${baseURL}/staff/${staffId}/upcomingShifts`, {
            withCredentials: true
            })
            .then(data =>  {
                setUserSchedule(data.data);
            })
            .catch(e => console.log("Error Pulling Weekly Schedule", e))
    }

    return (
        <div>
            <h2>My Upcoming Shifts</h2>
            {userSchedule.map((oneSched) => (
                <div key={oneSched._id}>{oneSched.date} - {oneSched.shift.name}</div>
            ))}
        </div>
    )
}

export default UserScheduledShifts;