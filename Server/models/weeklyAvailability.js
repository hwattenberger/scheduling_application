const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const WeeklyAvailabilitySchema = new Schema({
    person: { type: Schema.Types.ObjectId, ref: 'User'},
    //0 = Sunday, 6 = Sat
    weekAvailability: [{
        shiftAvailability: [{
            shiftType: { type: Schema.Types.ObjectId, ref: 'ShiftType'},
            free: Boolean
        }]
    }]
})

module.exports = mongoose.model('WeeklyAvailability', WeeklyAvailabilitySchema);