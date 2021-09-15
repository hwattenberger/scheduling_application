const User =  require('../models/user');
const Availability = require('../models/availability');
const TimeoffRequest = require('../models/timeoffRequest');

module.exports.getAllStaff = async (req, res) => {
    const staff = await User.find({}, {password: 0}).populate({path:'userRole'});
    // delete staff.password;
    // console.log("Staff", staff);
    res.json(staff);
}

module.exports.getStaffMember = async (req, res) => {
    const {staffId} = req.params;
    const staffMember = await User.findById(staffId).populate({path:'userRole'});

    delete staffMember.password;

    console.log("Staff Query", staffMember);

    res.json(staffMember)
}

module.exports.putStaffMember = async (req, res) => {
    const {staffId} = req.params;
    const updatedUser = req.body.body;

    const staffMember = await User.findByIdAndUpdate(staffId, updatedUser, {omitUndefined:true});
    // const staff = await User.find({});
    console.log("Staff", req.params);
    console.log("Staff Query", staffMember);
    console.log("Again", updatedUser)
    // console.log("Again2", updatedUser.isAdmin)

    res.json(staffMember)
}

module.exports.getUpcomingShifts = async (req, res) => {
    const {staffId} = req.params;
    const todayDate = new Date();
    const userShifts = await ScheduleShift.find({peopleAssigned: staffId, date: {$gte: todayDate}})
      .populate({path: 'shift'});
    
    console.log("User Shifts: ", userShifts, staffId);

    res.json(userShifts);
}

module.exports.getUserAvailability = async (req, res) => {
    const {staffId} = req.params;
    const userAvailable = await Availability.find({person: staffId})
        .sort({dayOfWeek: 1})
        .populate('shiftAvailability.shiftType');
    
    console.log("User Availability: ", userAvailable);

    res.json(userAvailable)
}

module.exports.putUserAvailability = async (req, res) => {
    const {staffId} = req.params;
    const updatedAvailability = req.body.body;

    console.log("Updated", updatedAvailability)

    for(let i=0; i<7; i++) {
        let oneDayAvailability = await Availability.findOneAndUpdate({person: staffId, dayOfWeek: i}, updatedAvailability[i], {omitUndefined:true})
        if (!oneDayAvailability) {
            newAvailability = new Availability({
                person: staffId,
                dayOfWeek: i,
                shiftAvailability: [...updatedAvailability[i].shiftAvailability]
            })
            console.log("New Availability", newAvailability)
            newAvailability.save();
        }
    }

    res.json("Saved")
}

module.exports.getUserTimeoff = async (req, res) => {
    const {staffId} = req.params;
    const staffRequestsOff = await TimeoffRequest.find({person: staffId}).sort({day: 1});
    
    // console.log("Requests Off: ", staffRequestsOff);

    res.json(staffRequestsOff)
}

module.exports.postUserTimeoff = async (req, res) => {
    const {staffId} = req.params;
    const {date} = req.body.body;
    console.log("Time Off Body", date);

    if(!date) res.json("No date specified");

    const newTimeOff = new TimeoffRequest({ person: staffId, day: date})
    await newTimeOff.save();

    res.json(newTimeOff);
}