const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    id: {
        type: String,
        default: null,
    },
    email: {
        type: String,
        required: [true, "email required"],
        unique: [true, "email already registered"],
    },
    firstName: String,
    lastName: String,
    profilePhoto: {
        url: String,
        filename: String
    },
    password: String,
    source: { type: String, required: [true, "source not specified"] },
    lastVisited: { type: Date, default: new Date() },
    userRole: {
        type: Schema.Types.ObjectId,
        ref: 'UserRole'
    },
    isActive: Boolean,
    hourlyPay: Number,
    isAdmin: Boolean
});

UserSchema.statics.addGoogleUser = function(newUser) {
    const { id, email, firstName, lastName } = newUser;
    const user = new this({
        id, email, firstName, lastName, source: "google"
    })
    return user.save();
}

UserSchema.statics.addLocalUser = function(newUser) {
    const { email, password } = newUser;
    const user = new this({
        email, password, source: "local"
    })
    return user.save();
}

UserSchema.statics.getUserByEmail = async function(email) {
    return await this.model('User').findOne({email});
}

module.exports = mongoose.model('User', UserSchema);