const TimeoffRequest = require('../models/timeoffRequest');

module.exports.deleteTimeoff = async (req, res) => {
    const {timeOffId} = req.params;

    const timeOffRequest = await TimeoffRequest.findById(timeOffId);
    await timeOffRequest.remove();

    res.send("Success");
}