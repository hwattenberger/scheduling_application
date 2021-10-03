const ScheduleShift = require('../models/scheduleShift');

module.exports.updateShift = async (req, res) => {
    const {schedShiftId} = req.params;
    const updScheduleShift = req.body;

    const scheduledShift = await ScheduleShift.findByIdAndUpdate(schedShiftId, updScheduleShift, {omitUndefined:true});

    res.json("Success");
}