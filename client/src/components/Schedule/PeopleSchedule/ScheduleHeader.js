import UserAvatar from '../../General/UserAvatar'

const ScheduleHeader = ({availability}) => {

    const bgColor = (personAvailability) => {
        const color = personAvailability.person.userRole.color
        return {backgroundColor: color};
    }

    return (
        <div className="dailyScheduleContainer">
            {availability[0].peopleAvailability.map((personAvailability) => (
                <div key={personAvailability.person._id} className="personDayBlock" style={bgColor(personAvailability)}>
                    <div>
                        <UserAvatar user={personAvailability.person} />
                    </div>
                    <div>
                        <div>{personAvailability.person.firstName} {personAvailability.person.lastName}</div>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default ScheduleHeader;