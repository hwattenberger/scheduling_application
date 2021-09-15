const UserRole = require('../models/userRole');

module.exports.getUserRoles = async (req, res) => {
    const userRoles = await UserRole.find({});
    res.json(userRoles);
}

module.exports.postUserRoles = async (req, res) => {
    const {userRole} = req.body;
    console.log("UserRole", userRole);

    if(!userRole) res.send("No user role specified");

    const newUserRole = new UserRole({ name: userRole})
    await newUserRole.save();

    res.json(newUserRole);
}

module.exports.deleteUserRoles = async (req, res) => {
    const {userRoleId} = req.params;

    const userRole = await UserRole.findById(userRoleId);
    await userRole.remove();

    res.send("Success");
}