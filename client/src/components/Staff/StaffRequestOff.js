import React, {useState, useEffect} from "react"
import {useParams} from "react-router-dom";
import dayjs from 'dayjs';
import axios from "axios";

import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button'
import DeleteIcon from '@material-ui/icons/Delete';


const StaffRequestOff = () => {
    const { staffId } = useParams();
    const [timeoff, setTimeoff] = useState([]);
    const [date, setDate] = useState(new Date());
    const baseURL = process.env.REACT_APP_API_BASE_URL;

    useEffect(() => {
        pullTimeoff();
    }, []);

    function pullTimeoff() {
        axios.get(`${baseURL}/staff/${staffId}/timeoff`, {
            withCredentials: true
            })
            .then(data =>  {
                setTimeoff(data.data);
            })
            .catch(e => console.log("Error pulling time off request", e))
    }

    function postTimeoff() {
        axios.post(`${baseURL}/staff/${staffId}/timeoff`, {date: date}, { withCredentials: true })
            .then(data =>  {
                setTimeoff([...timeoff, data.data])
            })
            .catch(e => console.log("Error pulling time off request", e))
    }

    function formatDatetoJustDate() {
        const formattedDate = dayjs(date).format('YYYY-MM-DD');
        return formattedDate;
    }

    function onClickDeleteDayOff(dayOffId) {
        axios.delete(`${baseURL}/timeOff/${dayOffId}`, {
            withCredentials: true
            })
            .then(data =>  {
                const newTimeOffs = timeoff.filter((timeoffReq) => timeoffReq._id !== dayOffId);
                setTimeoff(newTimeOffs)
            })
            .catch(e => console.log("Error pulling time off request", e))
    }

    function onClickTimeoff(e) {
        e.preventDefault();
        postTimeoff();
    }

    return (
        <div id="staffTimeoff">
            <h2>Request Time Off</h2>
            <DatePickerTimeoff date={formatDatetoJustDate()} setDate={setDate} onClickTimeoff={onClickTimeoff}/>
            <h3>Upcoming Time Off</h3>
            <div id="upcomingTimeOffDiv">
                {timeoff.map((dayOff) => (
                    <div key={dayOff._id}>{dayjs(dayOff.day).format('MM/DD/YYYY')}<span onClick={() => {onClickDeleteDayOff(dayOff._id)}}><DeleteIcon/></span></div>
                ))}
            </div>
        </div>
    )
}

function DatePickerTimeoff({date, setDate, onClickTimeoff}) {

    function onChange(e) {
        setDate(dayjs(e.target.value).format())
    }

    return (
      <form noValidate>
        <TextField
          onChange={onChange}
          id="date"
          type="date"
          value={date}
          InputLabelProps={{
            shrink: true,
          }}
        />
        <Button variant="outlined" type="submit" onClick={onClickTimeoff}>Request Off</Button>
      </form>
    );
  }

export default StaffRequestOff;