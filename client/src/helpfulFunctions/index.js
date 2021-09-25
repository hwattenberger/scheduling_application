const getPersonDayStatus = (personSched) => {
    if (personSched.scheduledShift.length > 1) return "Multiple"
    if (personSched.scheduledShift.length > 0) return "Scheduled"
    if (personSched.timeoff.length > 0) return "Timeoff"
    if (personSched.shiftAvail.length > 0) return "Available"
    return "Unavailable"
}

module.exports = {getPersonDayStatus}