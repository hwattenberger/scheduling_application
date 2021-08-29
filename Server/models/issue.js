const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const IssueSchema = new Schema({
    title: String,
    topic: String,
    status: String,
    completionDate: Date,
    createDate: Date,
    createUser: String,
    details: String,
    ownUser: String,
    priority: String,
    effort: String
})

module.exports = mongoose.model('Issue', IssueSchema);