const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ShiftSchema = new Schema({
    shiftType: {
        type: Schema.Types.ObjectId,
        ref: 'ShiftType'
    },
    shiftsNeeded: [{
        role: { type: Schema.Types.ObjectId, ref: 'UserRole'},
        numberNeeded: Number,
        scheduledUsers: { type: Schema.Types.ObjectId, ref: 'User'}
    }]
})

const DaySchema = new Schema({
    date: Date,
    week: Number,
    shifts: [ShiftSchema]
})

module.exports = mongoose.model('Day', DaySchema);