const ShiftType = require('../models/shiftType');
const ScheduleShift = require('../models/scheduleShift');
const ScheduleWeek = require('../models/scheduleWeek');
const TimeoffRequest = require('../models/timeoffRequest');
const mongoose = require('mongoose');


const dayjs = require('dayjs');

module.exports.getScheduleWeek = async (req, res) => {
    const {date} = req.query;
    const formattedDate = dayjs(date).format('YYYY-MM-DD')
    const sundayOfWeek = dayjs(formattedDate).day(0);

    const scheduleWeek = await ScheduleWeek.findOne({firstDayOfWeek: sundayOfWeek}).populate("days.scheduleShifts")
        .populate("days.scheduleShifts.shift.name")
        

    console.log("scheduleWeek", date, sundayOfWeek);
    
    res.json(scheduleWeek);
}

module.exports.postScheduleWeek = async (req, res) => {
    const {date} = req.body;
    const formattedDate = dayjs(date).format('YYYY-MM-DD')
    const sundayOfWeek = dayjs(formattedDate).day(0);
    const shifts = await ShiftType.find({});

    const newScheduleWeekObj = {
        firstDayOfWeek: sundayOfWeek,
        days: []
    }

    for (let i = 0; i < 7; i++) {
        const daysDate = dayjs(sundayOfWeek).add(i,'day');
        const shiftArr = [];

        for (shift of shifts) {
            const newShiftForDay = new ScheduleShift({
                date: daysDate,
                shift,
                peopleNeeded: shift.defNum
            })
            await newShiftForDay.save();
            shiftArr.push(newShiftForDay);
        }

        newScheduleWeekObj.days[i] = {
            date: daysDate,
            scheduleShifts: [...shiftArr]
        }
    }

    const newScheduleWeek = new ScheduleWeek(newScheduleWeekObj)
    await newScheduleWeek.save();
    
    res.json(newScheduleWeek);
}

module.exports.copyPreviousWeek = async (req, res) => {
    async function isValidShift(person, shift, daysDate) {
        const staffRequestsOff = await TimeoffRequest.find({person: person, day: daysDate});
        if (staffRequestsOff.length) return false;
        return true;
    }

    const {date} = req.body;
    const formattedDate = dayjs(date).format('YYYY-MM-DD')
    const sundayOfWeek = dayjs(formattedDate).day(0);
    const sundayOfLastWeek = sundayOfWeek.subtract(7, 'day');

    const lastScheduleWeek = await ScheduleWeek.findOne({firstDayOfWeek: sundayOfLastWeek});
    if(lastScheduleWeek == null) return res.status(406).json({message: "ERROR", error: "No schedule for previous week"})

    const newScheduleWeekObj = {
        firstDayOfWeek: sundayOfWeek,
        days: []
    }

    for (let i = 0; i < 7; i++) {
        const daysDate = dayjs(sundayOfWeek).add(i,'day');
        const shiftArr = [];

        for (dayShift of lastScheduleWeek.days[i].scheduleShifts) {

            const oldShift = await ScheduleShift.findById(dayShift)
            
            const newPeopleAssigned = [];

            if(oldShift.peopleAssigned.length > 0) {
                const oldPeopleAssigned = [...oldShift.peopleAssigned]

                for (personAssigned of oldPeopleAssigned) {
                    if (await isValidShift(personAssigned, oldShift.shift, daysDate)) newPeopleAssigned.push(personAssigned)
                }
            }
            
            const newShift = new ScheduleShift({
                shift: oldShift.shift,
                peopleNeeded: oldShift.peopleNeeded,
                peopleAssigned: [...newPeopleAssigned],
                date: daysDate,
                _id: mongoose.Types.ObjectId()
            })
            await newShift.save();
            shiftArr.push(newShift);
        }
        newScheduleWeekObj.days[i] = {
            date: daysDate,
            scheduleShifts: [...shiftArr]
        }
    }

    const newScheduleWeek = new ScheduleWeek(newScheduleWeekObj)
    await newScheduleWeek.save();
    
    res.json(newScheduleWeek);
}