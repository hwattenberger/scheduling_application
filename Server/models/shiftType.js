const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const ShiftTypeSchema = new Schema({
    name: String,
    defaultNumPerRole: [{
        role: { type: Schema.Types.ObjectId, ref: 'userRole'},
        defNum: Number
    }]
})

module.exports = mongoose.model('ShiftType', ShiftTypeSchema);