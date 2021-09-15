const ShiftType = require('../models/shiftType');

module.exports.getShiftTypes = async (req, res) => {
    const {role} = req.query;

    let shifts=""

    if (role) shifts = await ShiftType.find({role: role}); 
    else shifts = await ShiftType.find({}).sort({role: 1}).populate({path:'role'});

    console.log("Shifts", shifts)
    res.json(shifts);
}

module.exports.postShiftTypes = async (req, res) => {
    const newShiftTypeInfo = req.body.body;
    console.log("UserRole", req.body.body);

    if(!newShiftTypeInfo.name) res.send("No shift name specified");
    if(newShiftTypeInfo.role === "") delete newShiftTypeInfo.role

    const newShiftType = new ShiftType(newShiftTypeInfo)
    await newShiftType.save();

    res.json(newShiftType);
}

module.exports.putShiftTypes = async (req, res) => {
    const {shiftId} = req.params;
    const updatedShiftInfo = req.body.body;

    if(updatedShiftInfo.role === "") delete updatedShiftInfo.role

    const updatedShift = await ShiftType.findByIdAndUpdate(shiftId, updatedShiftInfo, {omitUndefined:true});
    console.log("Staff", req.params);
    console.log("Staff Query", updatedShiftInfo);
    console.log("Again", updatedShift)

    res.json(updatedShift)
}