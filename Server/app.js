if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const express = require('express');
const session = require('express-session');
// const flash = require('connect-flash');
const bodyParser = require("body-parser");
const cors = require('cors');
const dayjs = require('dayjs');

const mongoose = require('mongoose');
const MongoDBStore = require('connect-mongo');

const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const User = require('./models/user');
const UserRole = require('./models/userRole');
const ShiftType = require('./models/shiftType');
const ScheduleShift = require('./models/scheduleShift');
const ScheduleWeek = require('./models/scheduleWeek');
const TimeoffRequest = require('./models/timeoffRequest');
const Availability = require('./models/availability');

const authRoutes = require('./routes/auth')

const port = process.env.PORT || 5000;
const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/scheduling_app';
const secret = process.env.SECRET || 'NotVerySecret';

mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const app = express();

app.use(express.static(__dirname));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({ origin: "http://localhost:3000", credentials: true}));

const store = MongoDBStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret: secret
    },
    touchAfter: 24 * 60 * 60    //This is in seconds
})

store.on("error", function(e){
    console.log("SESSION STORE ERROR", e);
})

const sessionConfig = {
    store,
    name: 'session',
    secret: secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
};

app.use(session(sessionConfig));
// app.use(flash());

require("./utils/google");
require("./utils/local");
require("./utils/passport");

app.use(passport.initialize());
app.use(passport.session());

// app.use((req, res, next) => {
//     res.locals.currentUser = req.user;
//     next();
// })

app.use('/auth', authRoutes);


app.get('/', (req, res) => {
    res.send("Yes!"+req.user);
})

app.get('/shifts', async (req, res) => {
    const {role} = req.query;

    let shifts=""

    if (role) shifts = await ShiftType.find({role: role}); 
    else shifts = await ShiftType.find({}).sort({role: 1}).populate({path:'role'});

    // console.log("Shifts", shifts)
    res.json(shifts);
})

app.get('/scheduleWeek', async (req, res) => {
    const {date} = req.query;
    const formattedDate = dayjs(date).format('YYYY-MM-DD')
    const sundayOfWeek = dayjs(formattedDate).day(0);

    const scheduleWeek = await ScheduleWeek.findOne({firstDayOfWeek: sundayOfWeek}).populate("days.scheduleShifts")
        .populate("days.scheduleShifts.shift.name")
        

    console.log("scheduleWeek", date, sundayOfWeek);
    
    res.json(scheduleWeek);
})

app.post('/scheduleWeek', async (req, res) => {
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
})

// const createShiftsForDay = async (date, shifts) => {
//     const returnArr = [];

//     await shifts.forEach(async (shift) => {
//         const newShiftForDay = new ScheduleShift({
//             date: date,
//             shift,
//             peopleNeeded: shift.defNum
//         })
//         await newShiftForDay.save();
//         returnArr.push(newShiftForDay);
//     })
//     console.log("ReturnArr", returnArr)
//     return returnArr;
// }

// app.post('/scheduleShifts/:shiftId', async (req, res) => {
//     const {shiftId} = req.params;
//     const scheduledShifts = req.body.body;

//     // const shiftsForDay = await ScheduleShift.find({});

//     // console.log("shiftsForDay", shiftsForDay);
    
//     res.json("");
// })

app.post('/shifts', async (req, res) => {
    const newShiftTypeInfo = req.body.body;
    console.log("UserRole", req.body.body);

    if(!newShiftTypeInfo.name) res.send("No shift name specified");
    if(newShiftTypeInfo.role === "") delete newShiftTypeInfo.role

    const newShiftType = new ShiftType(newShiftTypeInfo)
    await newShiftType.save();

    res.json(newShiftType);
})

app.put('/shifts/:shiftId', async (req, res) => {
    const {shiftId} = req.params;
    const updatedShiftInfo = req.body.body;

    if(updatedShiftInfo.role === "") delete updatedShiftInfo.role

    const updatedShift = await ShiftType.findByIdAndUpdate(shiftId, updatedShiftInfo, {omitUndefined:true});
    console.log("Staff", req.params);
    console.log("Staff Query", updatedShiftInfo);
    console.log("Again", updatedShift)

    res.json(updatedShift)
})

app.get('/userRole', async (req, res) => {
    const userRoles = await UserRole.find({});
    res.json(userRoles);
})

app.get('/staff', async (req, res) => {
    const staff = await User.find({}, {password: 0}).populate({path:'userRole'});
    // delete staff.password;
    // console.log("Staff", staff);
    res.json(staff);
})

// app.get('/staffAvailability/:staffId', async (req, res) => {
//     const {staffId} = req.params;
//     const firstDate = req.query.date;

//     const test = await WeeklyAvailability.aggregate([{
//         $lookup: {
//             from: 'TimeoffRequest',
//             let: {person: '$person'},
//             pipeline: [{$match: {
//                 $expr: {
//                     $eq: ['$person', '$$person']
//                 }
//             }

//             }],
//             as: 'timeOffPerson'
//         }
//     }])
//     // const shiftsScheduled = await ScheduleShift.aggregate([{$group: {_id: '$date', shifts: {$push: {shift: '$shift', _id:'$_id'}}}},
//     // {$project: {date: '$_id', shifts: 1, _id: 0}}])



//     console.log("firstDate", firstDate)
//     console.log("shiftsScheduled", test)

//     // const weeklyAvailabilityAll = await WeeklyAvailability.find({})

//     res.json(test);
// })

// app.get('/staffAvailabilityTEST', async (req, res) => {
//     const {date} = req.query;
//     const staff = await WeeklyAvailability.find({})
//     .populate('person', 'firstName lastName profilePhoto')
//     .populate('person.userRole')
//     .populate('weekAvailability.shiftAvailability.shiftType');

//     //Get information about scheduled shifts
//     const scheduleWeek = await ScheduleWeek.findOne({firstDayOfWeek: date}).populate("days.scheduleShifts")
    
//     for (let i=0; i<7; i++) {
//         for (let scheduleShift of scheduleWeek.days[i].scheduleShifts) {
//             const shiftType = scheduleShift.shift;
//             for (let peopleAssign of scheduleShift.peopleAssigned) {
//                 const personId = peopleAssign._id;
//                 staff.forEach((person, personIx) => {
//                     if (person.person._id.equals(personId)) {
//                         const newStaffAvailability = {...staff[personIx].weekAvailability[i]};
//                         newStaffAvailability.scheduledShift = shiftType;
//                         console.log("Match", newStaffAvailability)
//                         staff[personIx].weekAvailability[i] = newStaffAvailability;
//                         console.log("Staff2", staff[personIx].weekAvailability[i]);
//                     }
//                 })
//             }
//         }
//     }

//     //Set scheduled information in staff before sending back to client
    

//     console.log("Staff", staff);
//     // console.log("Schedule Week", scheduleWeek)
//     res.json(staff);
// })

// app.get('/staffAvailability', async (req, res) => {
//     const staff = await Availability.find({})
//     .populate('person', 'firstName lastName profilePhoto')
//     .populate('person.userRole')
//     .populate('shiftAvailability.shiftType');
//     // delete staff.password;
//     // console.log("Staff", staff);
//     res.json(staff);
// })

// app.get('/staffAvailabilityDateOld', async (req, res) => {
//     const {date} = req.query;
//     const newDate = new Date(date);

//     const getWeekAvailability = await Availability.aggregate([{
//         $lookup: {
//             from: 'scheduleshifts',
//             let: {dayofweek: '$dayOfWeek', person: '$person'},
//             pipeline: [{$match: {
//                 $expr: {
//                     $and: [
//                         { $in: ['$$person', '$peopleAssigned'] },
//                         { $eq: [{ $add: [ {$multiply: ['$$dayofweek' , 24 * 60 * 60000]}, newDate]}, '$date']}
//                     ]
//                 }
//             }}],
//             as: 'shiftAssigned'
//         }
//     },{ 
//         $sort : {_id: 1}
//     }])

//     console.log("getWeekAvailability", getWeekAvailability)

//     res.json(getWeekAvailability);
// })

app.get('/staffAvailabilityDate', async (req, res) => {
    const {date} = req.query;
    const newDate = new Date(date);

    const getWeekAvailability = await Availability.aggregate([{
        $lookup: {
            from: 'timeoffrequests',
            let: {dayofweek: '$dayOfWeek', person: '$person'},
            pipeline: [{$match: {
                $expr: {
                    $and: [
                        { $eq: ['$person', '$$person'] },
                        { $eq: [{ $add: [ {$multiply: ['$$dayofweek' , 24 * 60 * 60000]}, newDate]}, '$day']}
                    ]
                }
            }}],
            as: 'timeoff'
        }
    },{
        $lookup: {
            from: 'scheduleshifts',
            let: {dayofweek: '$dayOfWeek', person: '$person'},
            pipeline: [{$match: {
                $expr: {
                    $and: [
                        { $in: ['$$person', '$peopleAssigned'] },
                        { $eq: [{ $add: [ {$multiply: ['$$dayofweek' , 24 * 60 * 60000]}, newDate]}, '$date']}
                    ]
                }
            }}],
            as: 'scheduledShift'
        }
    },{ 
        $lookup: {
            from: "users",
            localField: "person",
            foreignField: "_id",
            as: "person"
        }
    },{
        $unwind: '$person'
    },{ 
        $lookup: {
            from: "userroles",
            localField: "person.userRole",
            foreignField: "_id",
            as: "person.userRole"
        }
    },{
        $unwind: '$person.userRole'
    },{
        $group: {
            _id: '$dayOfWeek',
            peopleAvailability: {
                $push: {
                    person: '$person',
                    shiftAvailability: '$shiftAvailability',
                    timeoff: '$timeoff',
                    scheduledShift: '$scheduledShift'
                }
            }
      }
    },{
        "$project": {
            "peopleAvailability.person.firstName": 1,
            "peopleAvailability.person.lastName": 1,
            "peopleAvailability.person._id": 1,
            "peopleAvailability.person.userRole": 1,
            "peopleAvailability.shiftAvailability.isAvailable": 1,
            "peopleAvailability.timeoff._id": 1,
            "peopleAvailability.shiftAvailability.shiftType": 1,
            "peopleAvailability.shiftAvailability.shiftTypes": 1,
            "peopleAvailability.scheduledShift": 1
        }
    },{ 
        $sort : {_id: 1}
    }])

    console.log("getWeekAvailability", getWeekAvailability)

    res.json(getWeekAvailability);
})

app.get('/staff/:staffId/upcomingShifts', async (req, res) => {
    const {staffId} = req.params;
    const todayDate = new Date();
    const userShifts = await ScheduleShift.find({peopleAssigned: staffId, date: {$gte: todayDate}})
      .populate({path: 'shift'});
    
    console.log("User Shifts: ", userShifts, staffId);

    res.json(userShifts);
})

app.get('/staff/:staffId/available', async (req, res) => {
    const {staffId} = req.params;
    const userAvailable = await Availability.find({person: staffId})
        .sort({dayOfWeek: 1})
        .populate('shiftAvailability.shiftType');
    
    console.log("User Availability: ", userAvailable);

    res.json(userAvailable)
})

app.put('/staff/:staffId/available', async (req, res) => {
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
})

app.get('/staff/:staffId/timeoff', async (req, res) => {
    const {staffId} = req.params;
    const staffRequestsOff = await TimeoffRequest.find({person: staffId}).sort({day: 1});
    
    // console.log("Requests Off: ", staffRequestsOff);

    res.json(staffRequestsOff)
})

app.post('/staff/:staffId/timeoff', async (req, res) => {
    const {staffId} = req.params;
    const {date} = req.body.body;
    console.log("Time Off Body", date);

    if(!date) res.json("No date specified");

    const newTimeOff = new TimeoffRequest({ person: staffId, day: date})
    await newTimeOff.save();

    res.json(newTimeOff);
})

app.delete('/timeoff/:timeOffId', async (req, res) => {
    const {timeOffId} = req.params;

    const timeOffRequest = await TimeoffRequest.findById(timeOffId);
    await timeOffRequest.remove();

    res.send("Success");
})

app.put('/scheduleShift/:schedShiftId', async (req, res) => {
    const {schedShiftId} = req.params;
    const updScheduleShift = req.body.body;

    const scheduledShift = await ScheduleShift.findByIdAndUpdate(schedShiftId, updScheduleShift, {omitUndefined:true});

    console.log("Staff", req.params);
    console.log("Staff Query", updScheduleShift);

    res.json("Success");
})

app.get('/staff/:staffId', async (req, res) => {
    const {staffId} = req.params;
    const staffMember = await User.findById(staffId).populate({path:'userRole'});

    delete staffMember.password;

    console.log("Staff Query", staffMember);

    res.json(staffMember)
})


app.put('/staff/:staffId', async (req, res) => {
    const {staffId} = req.params;
    const updatedUser = req.body.body;

    const staffMember = await User.findByIdAndUpdate(staffId, updatedUser, {omitUndefined:true});
    // const staff = await User.find({});
    console.log("Staff", req.params);
    console.log("Staff Query", staffMember);
    console.log("Again", updatedUser)
    // console.log("Again2", updatedUser.isAdmin)

    res.json(staffMember)
})

app.post('/userRole', async (req, res) => {
    const {userRole} = req.body;
    console.log("UserRole", userRole);

    if(!userRole) res.send("No user role specified");

    const newUserRole = new UserRole({ name: userRole})
    await newUserRole.save();

    res.json(newUserRole);
})

//Need to delete out of users too probably
app.delete('/userRole/:userRoleId', async (req, res) => {
    const {userRoleId} = req.params;

    const userRole = await UserRole.findById(userRoleId);
    await userRole.remove();

    res.send("Success");
})

app.listen(port, () => {
    console.log("Listening on port 5000")
})