const User =  require('../models/user');
const Availability = require('../models/availability');
const TimeoffRequest = require('../models/timeoffRequest');
const ScheduleShift = require('../models/scheduleShift');
const cloudinary = require('../addons/cloudinary')
const dayjs = require('dayjs');

module.exports.getAllStaff = async (req, res) => {
    const staff = await User.find({}, {password: 0}).sort({firstName: 1}).populate({path:'userRole'});

    res.json(staff);
}

module.exports.getStaffMember = async (req, res) => {
    const {staffId} = req.params;
    const staffMember = await User.findById(staffId).populate({path:'userRole'});

    staffMember.password = undefined;

    res.json(staffMember)
}

module.exports.putStaffMember = async (req, res) => {
    const {staffId} = req.params;
    const updatedUser = req.body.updatedStaff;
    
    if (updatedUser.userRole === "") updatedUser.userRole = undefined;
    
    const staffMember = await User.findByIdAndUpdate(staffId, updatedUser, {new: true, omitUndefined:true}).populate({path:'userRole'});

    staffMember.password = undefined;
    res.json(staffMember)
}

module.exports.putStaffMemberWImage = async (req, res) => {
    const {staffId} = req.params;
    const updatedUser = JSON.parse(req.body.userInput);
    const updatedImg = req.file;

    if(updatedImg) {
        //Delete existing image
        if(updatedUser.profilePhoto) {
            await cloudinary.deleteCloudImage(updatedUser.profilePhoto.filename);
        }

        updatedUser.profilePhoto = {
            filename: updatedImg.filename,
            url: updatedImg.path
        }
    }

    const staffMember = await User.findByIdAndUpdate(staffId, updatedUser, {new: true, omitUndefined:true});

    staffMember.password = undefined;
    res.json(staffMember)
}

module.exports.getUpcomingShifts = async (req, res) => {
    const {staffId} = req.params;
    const todayDate = dayjs().format('YYYY-MM-DD')
    const userShifts = await ScheduleShift.find({peopleAssigned: staffId, date: {$gte: todayDate}})
      .populate({path: 'shift'}).sort({date: 1});

    res.json(userShifts);
}

module.exports.getUserAvailability = async (req, res) => {
    const {staffId} = req.params;
    const userAvailable = await Availability.find({person: staffId})
        .sort({dayOfWeek: 1})
        .populate('shiftAvailability.shiftType');

    res.json(userAvailable)
}

module.exports.putUserAvailability = async (req, res) => {
    const {staffId} = req.params;
    const updatedAvailability = req.body.userWeeklyAvail;

    for(let i=0; i<7; i++) {
        let oneDayAvailability = await Availability.findOneAndUpdate({person: staffId, dayOfWeek: i}, updatedAvailability[i], {omitUndefined:true})
        if (!oneDayAvailability) {
            newAvailability = new Availability({
                person: staffId,
                dayOfWeek: i,
                shiftAvailability: [...updatedAvailability[i].shiftAvailability]
            })
            newAvailability.save();
        }
    }

    res.json("Saved")
}

module.exports.getUserTimeoff = async (req, res) => {
    const {staffId} = req.params;
    const todayDate = dayjs().format('YYYY-MM-DD')

    const staffRequestsOff = await TimeoffRequest.find({person: staffId, day: {$gte: todayDate}}).sort({day: 1});

    res.json(staffRequestsOff)
}

module.exports.postUserTimeoff = async (req, res) => {
    const {staffId} = req.params;
    const {date} = req.body;

    if(!date) res.status(405).json("No date specified");
    const formattedDate = dayjs(date).format('YYYY-MM-DD')

    const newTimeOff = new TimeoffRequest({ person: staffId, day: formattedDate})
    await newTimeOff.save();

    res.json(newTimeOff);
}