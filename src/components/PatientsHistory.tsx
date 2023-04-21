import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { FunctionComponent, useState } from 'react';
import IAppointmentHistoryResponse from '../types/appointments_api/responses/IAppointmentHistoryResponse';

interface PatientHistoryProps {
    options: IAppointmentHistoryResponse[];
}

const PatientHistory: FunctionComponent<PatientHistoryProps> = ({ options }) => {
    const [appointments, setAppointments] = useState(options);

    // const columns: GridColDef[] = [
    //     { field: 'date', headerName: 'Date', flex: 1 },
    //     { field: 'time', headerName: 'Time', flex: 1 },
    //     { field: 'doctorFullName', headerName: 'Doctor full name', flex: 1 },
    //     { field: 'serviceName', headerName: 'Service', flex: 1 },
    //     { field: 'manage', headerName: 'Manage' },
    // ];

    const rows = appointments.map((item, index) => {
        return {
            id: index,
            date: item.date.format('DD MMMM YYYY'),
            time: `${item.startTime.format('HH:mm')} - ${item.endTime.format('HH:mm')}`,
            doctorFullName: item.doctorFullName,
            serviceName: item.serviceName,
        };
    });

    return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }}>
                <TableHead>
                    <TableRow>
                        <TableCell>Date</TableCell>
                        <TableCell align='right'>Time</TableCell>
                        <TableCell align='right'>Doctor full name</TableCell>
                        <TableCell align='right'>Service</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {/* {appointments.map((item) => (
                        <TableRow key={} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                            <TableCell component='th' scope='row'>
                                {row.name}
                            </TableCell>
                            <TableCell align='right'>{row.calories}</TableCell>
                            <TableCell align='right'>{row.fat}</TableCell>
                            <TableCell align='right'>{row.carbs}</TableCell>
                            <TableCell align='right'>{row.protein}</TableCell>
                        </TableRow>
                    ))} */}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default PatientHistory;
