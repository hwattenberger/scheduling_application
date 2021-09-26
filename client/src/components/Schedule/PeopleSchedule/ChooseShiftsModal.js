import React, { useState, useEffect } from "react";
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';

import {Dialog, DialogActions, DialogContent, DialogTitle} from '@material-ui/core';
import {List, ListItem, ListItemIcon, ListItemText, Checkbox} from '@material-ui/core';

const ChooseShiftsModal = ({currentStatus, personSched, setShift, shifts}) => {
    const [open, setOpen] = useState(false);
    const [checked, setChecked] = useState([]);
    const [showSnackbar, setShowSnackbar] = useState(false);
    const [dragOver, setDragOver] = useState(false);

    useEffect(() => {
        clearChecks();
    }, [])

    const handleToggle = (ix) => () => {
        const newChecked = [...checked]
        newChecked[ix] = !newChecked[ix]

        setChecked(newChecked);
    };

    const clearChecks = () => {
        const newChecked = [];
        let found = false;
        personSched.shiftAvail.forEach((shift, ix) => {
            found = false;
            for (let i = 0; i < personSched.scheduledShift.length; i++) {
                if(shift.shiftType === personSched.scheduledShift[i].shift) found=true;
            }
            newChecked[ix] = found;
        })
        setChecked(newChecked);
    }

    const onDragOver = (e) => {
        e.preventDefault();
        setDragOver(true);
    }

    const onDragLeave = (e) => {
        setDragOver(false);
    }

    const onDrop = (e) => {
        setDragOver(false);
        const droppedShiftType = e.dataTransfer.getData('shiftType');
        
        if(availableForShiftType(droppedShiftType) && !alreadyScheduledforShiftType(droppedShiftType)) {
            handleSaveAddShift(droppedShiftType);
        }
        else setShowSnackbar(true);
    }

    const handleSaveAddShift = (shiftType) => {
        const updatedShifts = [];
        updatedShifts[0] = {
            shift: shiftType,
            scheduled: true
        }

        setShift(updatedShifts);
        clearChecks();
    };

    const alreadyScheduledforShiftType = (droppedShiftType) => {
        return personSched.scheduledShift.some((shift) => {
            return (shift.shift == droppedShiftType)
        })
    }

    const availableForShiftType = (droppedShiftType) => {
        return personSched.shiftAvail.some((shift) => {
            return (shift.shiftType == droppedShiftType)
        })
    }

    const handleClickOpen = () => {
        setOpen(true);
    };
  
    const handleClose = () => {
        clearChecks();
        setOpen(false);
    };

    const handleSave = () => {
        const updatedShifts = personSched.shiftAvail.map((shift, ix) => {
            return {
                shift: shift.shiftType,
                scheduled: checked[ix]
            }
        })
        setOpen(false);
        setShift(updatedShifts);
    };

    function handleSnackClose() {
        setShowSnackbar(false);
    }

    const labelId = (shift) => {
        return `checkbox-list-label-${shift.shiftType}`
    }

    const classListMainDiv = () => {
        if(dragOver) return "dayPersonAvailableSlot dragOver"
        return "dayPersonAvailableSlot"
    }

    return (
      <div className={classListMainDiv()} onDrop={onDrop} onDragOver={onDragOver} onDragLeave={onDragLeave}>
        <Button aria-controls="fade-menu" aria-haspopup="true" onClick={handleClickOpen}>
            {currentStatus}
        </Button>
        <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">Shifts Available</DialogTitle>
            <DialogContent>
                <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                {personSched.shiftAvail.map((shift, ix) => (
                        <ListItem key={shift.shiftType} role={undefined} dense button onClick={handleToggle(ix)}>
                            <ListItemIcon>
                                <Checkbox
                                edge="start"
                                checked={checked[ix]}
                                tabIndex={-1}
                                disableRipple
                                inputProps={{ 'aria-labelledby': labelId(shift) }}
                                />
                            </ListItemIcon>
                            <ListItemText id={labelId(shift)} primary={shifts[shift.shiftType].name} />
                        </ListItem>
                ))}
                </List>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="primary">
                    Cancel
                </Button>
                <Button onClick={handleSave} color="primary">
                    Accept
                </Button>
            </DialogActions>
        </Dialog>
        <Snackbar
                anchorOrigin={{vertical: 'top', horizontal: 'center'}}
                open={showSnackbar}
                onClose={handleSnackClose}
                message="This is not a valid shift for this person"
                key={'topcenter'} />
      </div>
    );
  }

export default ChooseShiftsModal;