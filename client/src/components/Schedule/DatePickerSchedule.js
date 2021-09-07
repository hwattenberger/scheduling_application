import TextField from '@material-ui/core/TextField';
import dayjs from 'dayjs';

function DatePickerSchedule({date, setDate}) {

    function onChange(e) {
        setDate(dayjs(e.target.value).format())
    }

    console.log("Here", date)
    return (
      <form noValidate>
        <span className="weekOfSpan">For week of:  </span>
        <TextField
          onChange={onChange}
          id="date"
          type="date"
          value={date}
          InputLabelProps={{
            shrink: true,
          }}
        />
      </form>
    );
  }

export default DatePickerSchedule;