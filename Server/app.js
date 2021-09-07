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
const WeeklyAvailability = require('./models/weeklyAvailability');
const ScheduleShift = require('./models/scheduleShift');
const ScheduleWeek = require('./models/scheduleWeek');

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

// app.get('/scheduleShifts', async (req, res) => {
//     const scheduleShifts = await ScheduleShift.find({})

//     // console.log("scheduleWeek", date);
    
//     res.json(scheduleShifts);
// })

app.get('/scheduleWeek', async (req, res) => {
    const {date} = req.query;
    const formattedDate = dayjs(date).format('YYYY-MM-DD')
    const mondayOfWeek = dayjs(formattedDate).day(1);

    let scheduleWeek = await ScheduleWeek.findOne({firstDayOfWeek: mondayOfWeek}).populate("days.scheduleShifts")
        .populate("days.scheduleShifts.shift.name")
        

    console.log("scheduleWeek", date);
    
    res.json(scheduleWeek);
})

app.post('/scheduleWeek', async (req, res) => {
    const {date} = req.body.body;
    const formattedDate = dayjs(date).format('YYYY-MM-DD')
    const mondayOfWeek = dayjs(formattedDate).day(1);
    const shifts = await ShiftType.find({});

    // console.log("Dates", date, formattedDate, mondayOfWeek)

    const newScheduleWeekObj = {
        firstDayOfWeek: mondayOfWeek,
        days: []
    }

    for (let i = 0; i < 7; i++) {
        const daysDate = dayjs(mondayOfWeek).add(i,'day');
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

app.get('/staffAvailability', async (req, res) => {
    const staff = await WeeklyAvailability.find({})
    .populate('person', 'firstName lastName profilePhoto')
    .populate('person.userRole')
    .populate('weekAvailability.shiftAvailability.shiftType');
    // delete staff.password;
    // console.log("Staff", staff);
    res.json(staff);
})

app.get('/staff/:staffId/available', async (req, res) => {
    const {staffId} = req.params;
    const userAvailable = await WeeklyAvailability.find({person: staffId}).populate('weekAvailability.shiftAvailability.shiftType');
    
    console.log("User Availability: ", userAvailable);

    res.json(userAvailable)
})

app.put('/staff/:staffId/available', async (req, res) => {
    const {staffId} = req.params;
    const updatedAvailability = req.body.body;

    // console.log("Updated", updatedAvailability)

    const updAvailabilityObject = {
        weekAvailability: [...updatedAvailability]
    }

    let userAvailable = await WeeklyAvailability.findOneAndUpdate({person: staffId}, updAvailabilityObject,{omitUndefined:true});

    console.log("userAvailable", userAvailable)

    if(!userAvailable) {
        userAvailable = new WeeklyAvailability({
            person: staffId,
            weekAvailability: [...updatedAvailability]
        })
        userAvailable.save();
    }
    
    console.log("User Availability Put", userAvailable);
    // console.log("Updated Availability", updatedAvailability)

    res.json(userAvailable)
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