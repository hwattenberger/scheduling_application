const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const ScheduleShiftSchema = new Schema({
    date: Date,
    shift: { type: Schema.Types.ObjectId, ref: 'ShiftType'},
    peopleAssigned: [{ type: Schema.Types.ObjectId, ref: 'User'}],
    peopleNeeded: Number
})

module.exports = mongoose.model('ScheduleShift', ScheduleShiftSchema);