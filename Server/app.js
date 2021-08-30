if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const express = require('express');
const session = require('express-session');
// const flash = require('connect-flash');
const bodyParser = require("body-parser");
const cors = require('cors');


const mongoose = require('mongoose');
const MongoDBStore = require('connect-mongo');

const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const User = require('./models/user');
const UserRole = require('./models/userRole');


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

app.get('/userRole', async (req, res) => {
    const userRoles = await UserRole.find({});

    res.json(userRoles);
})

app.get('/staff', async (req, res) => {
    const staff = await User.find({});
    console.log("Staff", staff);
    res.json(staff);
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