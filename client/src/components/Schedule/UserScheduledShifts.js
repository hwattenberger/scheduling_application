import React, {useState, useEffect} from "react"
import {useParams} from "react-router-dom";
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