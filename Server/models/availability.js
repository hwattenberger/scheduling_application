const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AvailabilitySchema = new Schema({
    person: { type: Schema.Types.ObjectId, ref: 'User'},
    dayOfWeek: Number,  //0 = Monday, 6 = Sunday
    shiftAvailability: [{
        shiftType: { type: Schema.Types.ObjectId, ref: 'ShiftType'},
        isAvailable: Boolean
    }]
})

module.exports = mongoose.model('Availability', AvailabilitySchema);