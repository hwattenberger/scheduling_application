const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserRoleSchema = new Schema({
    name: String,
    color: String
})

module.exports = mongoose.model('UserRole', UserRoleSchema);