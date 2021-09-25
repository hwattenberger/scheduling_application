const ShiftType = require('../models/shiftType');

module.exports.getShiftTypes = async (req, res) => {
    const {role} = req.query;

    let shifts=""

    if (role) shifts = await ShiftType.find({role: role}); 
    else shifts = await ShiftType.find({}).sort({role: 1}).populate({path:'role'});

    // console.log("Shifts", shifts)
    res.json(shifts);
}

module.exports.postShiftTypes = async (req, res) => {
    const newShiftTypeInfo = req.body.shiftType;
    console.log("Shift Type", req.body.shiftType);

    if(!newShiftTypeInfo.name) res.send("No shift name specified");
    if(newShiftTypeInfo.role === "") delete newShiftTypeInfo.role

    const newShiftType = new ShiftType(newShiftTypeInfo)
    await newShiftType.save();

    const returnShiftType = await ShiftType.findById(newShiftType._id).populate({path:'role'});

    res.json(returnShiftType);
}

module.exports.putShiftTypes = async (req, res) => {
    const {shiftId} = req.params;
    const updatedShiftInfo = req.body.updatedShift;

    // if(updatedShiftInfo.role && updatedShiftInfo.role._id) updatedShiftInfo.role = updatedShiftInfo.role._id;

    if(updatedShiftInfo.role === "") delete updatedShiftInfo.role

    const updatedShift = await ShiftType.findByIdAndUpdate(shiftId, updatedShiftInfo, {omitUndefined:true, new:true}).populate({path:'role'});

    res.json(updatedShift)
}