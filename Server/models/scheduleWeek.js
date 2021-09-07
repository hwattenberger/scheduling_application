const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const ScheduleWeekSchema = new Schema({
    firstDayOfWeek: Date,
    days: [{
        date: Date,
        scheduleShifts: [{ type: Schema.Types.ObjectId, ref: 'ScheduleShift'}]
    }]
})

module.exports = mongoose.model('ScheduleWeek', ScheduleWeekSchema);