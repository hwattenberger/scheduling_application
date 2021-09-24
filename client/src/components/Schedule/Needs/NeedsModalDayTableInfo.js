import NumericInput from 'react-numeric-input';
import {Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper} from '@material-ui/core';

const NeedsModalDayTableInfo = ({dayShiftNumbers, shifts, onChange}) => {

    return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
                <TableHead>
                <TableRow>
                    <TableCell>Shift</TableCell>
                    <TableCell>Position</TableCell>
                    <TableCell align="right"># Scheduled</TableCell>
                    <TableCell align="right"># Needed</TableCell>
                </TableRow>
                </TableHead>
                <TableBody>
                {dayShiftNumbers.map((scheduleShift, shiftIx) => (
                    <TableRow
                    key={scheduleShift._id}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                    <TableCell component="th" scope="row">
                    {shifts[scheduleShift.shift] && shifts[scheduleShift.shift].name}
                    </TableCell>
                    <TableCell>{shifts[scheduleShift.shift].role.name}</TableCell>
                    <TableCell align="right">{scheduleShift.peopleAssigned.length}</TableCell>
                    <TableCell align="right"><NumericInput name="defNum" className="inputField" size="1" label="Defalt Number" onChange={(e) => onChange(e, shiftIx)}
                        value={scheduleShift.peopleNeeded} min={0} max={100}/></TableCell>
                    </TableRow>
                ))}
                </TableBody>
            </Table>
        </TableContainer>
    )

  }

  export default NeedsModalDayTableInfo;