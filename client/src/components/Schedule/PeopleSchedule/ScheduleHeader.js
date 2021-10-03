import UserAvatar from '../../General/UserAvatar'

const ScheduleHeader = ({availability, filterRole}) => {

    const bgColor = (personAvailability) => {
        const color = personAvailability.person.userRole.color
        return {backgroundColor: color};
    }

    const displayHeader = (personAvailability) => {
        if (filterRole && personAvailability.person.userRole._id !== filterRole) return null;

        return (
            <div className="personDayBlock" style={bgColor(personAvailability)}>
                    <div>
                        <UserAvatar user={personAvailability.person} />
                    </div>
                    <div>
                        <div>{personAvailability.person.firstName} {personAvailability.person.lastName}</div>
                    </div>
                </div>
        )
    }

    return (
        <div className="dailyScheduleContainer">
            {availability[0].peopleAvailability.map((personAvailability) => (
                <div key={personAvailability.person._id}>
                {displayHeader(personAvailability)}
                </div>
            ))}
        </div>
    )
}

export default ScheduleHeader;