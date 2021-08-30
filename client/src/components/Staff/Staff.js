import axios from "axios";
import { useState, useEffect } from "react";


const Staff = (props) => {
    const [staff, setStaff] = useState([]);

    useEffect(() => {
        getStaff();
    }, []);

    function getStaff() {
        axios.get('http://localhost:5000/staff', {withCredentials: true})
            .then(data => setStaff(data.data))
            .catch(e => console.log("Error Staff", e))
    }

    //TODO: ADD KEY
    return (
        <div id="staffPage">
            <h2>Staff</h2>
            {staff.map((person) => (
                <div>{person.email}</div>
            ))}
        </div>
    );
}

export default Staff;