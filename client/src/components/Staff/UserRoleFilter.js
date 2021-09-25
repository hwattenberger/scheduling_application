import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    formControl: {
      minWidth: 100
    }
}));

const UserRoleFilter = ({filterRole, setFilterRole, roles}) => {
    const classes = useStyles();

    const handleInputChangeRole = (e) => {
        setFilterRole(e.target.value);
    }

    return (
        <FormControl className={classes.formControl}>  
            <InputLabel id="role-select-label">Role</InputLabel>
            <Select labelId="role-select-label" value={filterRole} name="role" onChange={handleInputChangeRole}>
            <MenuItem value="">
                <em>Show All</em>
            </MenuItem>
            {roles.map((role) => (
                <MenuItem key={role._id} value={role._id}>{role.name}</MenuItem>
            ))}
            </Select>
        </FormControl>
    )
}

export default UserRoleFilter