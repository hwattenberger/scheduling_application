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
    profilePhoto: String,
    password: String,
    source: { type: String, required: [true, "source not specified"] },
    lastVisited: { type: Date, default: new Date() },
    userRole: {
        type: Schema.Types.ObjectId,
        ref: 'UserRole'
    },
    active: Boolean,
    hourlyPay: Number
});

UserSchema.statics.addGoogleUser = function(newUser) {
    const { id, email, firstName, lastName } = newUser;
    const user = new this({
        id, email, firstName, lastName, source: "google"
    })
    return user.save();
}

UserSchema.statics.addLocalUser = function(newUser) {
    const { id, email, firstName, lastName, password } = newUser;
    const user = new this({
        id, email, firstName, lastName, source: "local"
    })
    return user.save();
}

UserSchema.statics.getUserByEmail = async function(email) {
    return await this.model('User').findOne({email});
}

module.exports = mongoose.model('User', UserSchema);