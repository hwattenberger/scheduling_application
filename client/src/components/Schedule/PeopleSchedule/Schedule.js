import React, { useState, useEffect } from "react";
import axios from "axios";
import dayjs from 'dayjs';

import ColumnContentNeeds from "../Needs/ColumnContentNeeds";
import NeedsHeader from "../Needs/NeedsHeader"
import ColumnContentSchedule from "./ColumnContentSchedule"

import CircularProgress from '@material-ui/core/CircularProgress';

const Schedule = ({weeklySchedule, date, staffShift, setWeeklySchedule}) => {
    const week = [".", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const [shifts, setShifts] = useState(null);
    const [availability, setWeeklyAvailability] = useState([]);
    const [gotInfo, setGotInfo] = useState(0);
    const baseURL = process.env.REACT_APP_API_BASE_URL;

    useEffect(() => {
        let isMounted = true;
        let tempGotInfo = 0;
        pullShifts();
        pullWeeklyAvailability();
        return () => {
            isMounted = false;
        };

        function pullShifts() {
            axios.get(`${baseURL}/shiftTypes`, { withCredentials: true })
                .then(data =>  {
                    const tempShifts = data.data;
                    const tempShiftObj = {};
                    tempShifts.forEach((shift) => {
                        tempShiftObj[shift._id] = shift;
                    })
                    if (isMounted) setShifts(tempShiftObj)
                    tempGotInfo++;
                    if (isMounted) setGotInfo(tempGotInfo);
                })
                .catch(e => console.log("Error Staff", e))
        }
    
        function pullWeeklyAvailability() {
            axios.get(`${baseURL}/staffAvailabilityDate`, {
                withCredentials: true,
                params: {date: weeklySchedule.firstDayOfWeek}
                })
                .then(data => { 
                    if (isMounted) setWeeklyAvailability(data.data);
                    tempGotInfo++;
                    if (isMounted) setGotInfo(tempGotInfo);
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

    // useEffect(() => {
    //     console.log("Reloading")
    // }, [weeklySchedule]);


    function dayName(columnIx) {
        if (columnIx===0) return <div className="dateSection"></div>;
        return (
            <div className="dateSection">
                <span className="dayName">{week[columnIx]} </span>
                {getDate(columnIx)}
            </div>)
    }

    function getDate(columnIx) {
        let utc = require('dayjs/plugin/utc');
        dayjs.extend(utc);
        return dayjs(weeklySchedule.firstDayOfWeek).utc(true).add(columnIx-1,'day').format("MM/DD");
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