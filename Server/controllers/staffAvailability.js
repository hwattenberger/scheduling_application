const Availability = require('../models/availability');

module.exports.getStaffAvailabilityForWeek = async (req, res) => {
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
            "peopleAvailability.person.profilePhoto.url": 1,
            "peopleAvailability.person.userRole": 1,
            "peopleAvailability.shiftAvailability.isAvailable": 1,
            "peopleAvailability.timeoff._id": 1,
            "peopleAvailability.shiftAvailability.shiftType": 1,
            "peopleAvailability.shiftAvailability.shiftTypes": 1,
            "peopleAvailability.scheduledShift": 1
        }
    },{ 
        $sort : {"_id": 1}
    }])

    console.log("getWeekAvailability", getWeekAvailability)

    res.json(getWeekAvailability);
}