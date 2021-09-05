const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const ShiftTypeSchema = new Schema({
    name: String,
    role: { type: Schema.Types.ObjectId, ref: 'UserRole'},
    defNum: Number,
    startTime: String,
    endTime: String
})

module.exports = mongoose.model('ShiftType', ShiftTypeSchema);