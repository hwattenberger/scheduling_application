import Avatar from '@material-ui/core/Avatar';

const UserAvatar = ({user}) => {

    const getAvatar = () => {
        if (user.profilePhoto) return <Avatar alt="Thumbnail" src={user.profilePhoto.url} />
        if (user.userRole && user.userRole.color) return <Avatar style={{ backgroundColor: user.userRole.color }}>{user.firstName.charAt(0)}{user.lastName.charAt(0)}</Avatar>
        else return <Avatar>{user.firstName.charAt(0)}{user.lastName.charAt(0)}</Avatar>
    }

    return (
        <div>
            {getAvatar()}
        </div>
    );
}

export default UserAvatar;