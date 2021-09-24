import React, { useState, useEffect } from "react";
import axios from "axios";

import NeedsModalDayTableInfo from './NeedsModalDayTableInfo'
import Button from '@material-ui/core/Button';
import { Edit } from '@material-ui/icons';

import {Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from '@material-ui/core';


const NeedsDayHeader = ({day, date, dayIx, daySchedule, shifts, setDaySchedule}) => {
    const [open, setOpen] = useState(false);
    const [dayShiftNumbers, setDayShiftNumbers] = useState([]);

    useEffect(() => {
        createDefaultNumbers();
    }, [])

    function saveShifts() {
        dayShiftNumbers.forEach((scheduleShift) => {
            axios.put(`http://localhost:5000/scheduleShift/${scheduleShift._id}`, scheduleShift, { withCredentials: true})
        })
    }
  
    const createDefaultNumbers = () => {
        const newShiftNumbers = daySchedule.scheduleShifts.map((shift) => {
            return {
                ...shift
            }
        })
        setDayShiftNumbers(newShiftNumbers);
    };

    const handleClickOpen = () => {
        setOpen(true);
    };
  
    const handleClose = () => {
        setOpen(false);
        createDefaultNumbers();
    };

    const handleSave = () => {
        setOpen(false);
        saveShifts();
        setDaySchedule(dayIx, dayShiftNumbers);
    };

    const onChange = (e, shiftIx) => {
        const newDayShiftNumbers = [...dayShiftNumbers];
        newDayShiftNumbers[shiftIx].peopleNeeded = e;
        setDayShiftNumbers(newDayShiftNumbers);
    }

    if(!dayShiftNumbers.length>0) return null;

    return (
      <div className="dayHeader">
        <span className="editNeeds" onClick={handleClickOpen}><Edit/></span>
        <span className="dayName">{day}</span>
        <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
          <DialogTitle id="form-dialog-title">Change Staff Needed for {day}, {date}</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Update the number of people you want to work for each shift:
            </DialogContentText>
            <NeedsModalDayTableInfo dayShiftNumbers={dayShiftNumbers} shifts={shifts} onChange={onChange}/>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Cancel
            </Button>
            <Button onClick={handleSave} color="primary">
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }

export default NeedsDayHeader;