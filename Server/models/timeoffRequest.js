const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TimeoffRequestSchema = new Schema({
    person: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    day: Date
})

module.exports = mongoose.model('TimeoffRequest', TimeoffRequestSchema);