const ShiftType = require('../models/shiftType');
const ScheduleShift = require('../models/scheduleShift');
const ScheduleWeek = require('../models/scheduleWeek');

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
    const {date} = req.body.body;
    const formattedDate = dayjs(date).format('YYYY-MM-DD')
    const sundayOfWeek = dayjs(formattedDate).day(0);
    const shifts = await ShiftType.find({});

    // console.log("Dates", date, formattedDate, sundayOfWeek)

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
        // console.log("Day shifts", shiftArr);

        newScheduleWeekObj.days[i] = {
            date: daysDate,
            scheduleShifts: [...shiftArr]
        }
    }

    const newScheduleWeek = new ScheduleWeek(newScheduleWeekObj)
    await newScheduleWeek.save();

    console.log("newScheduleWeek", newScheduleWeek);
    
    res.json(newScheduleWeek);
}