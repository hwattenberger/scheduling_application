if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const express = require('express');
const session = require('express-session');
// const flash = require('connect-flash');
// const bodyParser = require("body-parser");
const cors = require('cors');

const mongoose = require('mongoose');
const MongoDBStore = require('connect-mongo');
// const User = require('./models/user');

const passport = require('passport');
// const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
// const LocalStrategy = require('passport-local').Strategy;
// const Availability = require('./models/availability');

const authRoutes = require('./routes/auth');
const shiftTypeRoutes = require('./routes/shiftType');
const staffRoutes = require('./routes/staff');
const userRoleRoutes = require('./routes/userRole');
const scheduleWeekRoutes = require('./routes/scheduleWeek');
const timeoffRoutes = require('./routes/timeoff');
const scheduleShiftRoutes = require('./routes/scheduleShift');
const staffAvailabilityRoutes = require('./routes/staffAvailability')

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

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

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
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
};

app.use(session(sessionConfig));
// app.use(flash());

require("./utils/local");
require("./utils/google");
require("./utils/passport");

app.use(passport.initialize());
app.use(passport.session());

// app.use((req, res, next) => {
//     res.locals.currentUser = req.user;
//     next();
// })

app.use('/auth', authRoutes);
app.use('/shiftTypes', shiftTypeRoutes);
app.use('/staff', staffRoutes);
app.use('/userRole', userRoleRoutes);
app.use('/scheduleWeek', scheduleWeekRoutes);
app.use('/timeoff', timeoffRoutes);
app.use('/scheduleShift', scheduleShiftRoutes);
app.use('/staffAvailabilityDate', staffAvailabilityRoutes);

app.get('/', (req, res) => {
    console.log("Main page", req.session)
    res.send("Yes!"+req.user+req.isAuthenticated());
})

app.listen(port, () => {
    console.log("Listening on port 5000")
})