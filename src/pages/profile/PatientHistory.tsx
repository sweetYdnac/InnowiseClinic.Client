import { Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow } from '@mui/material';
import dayjs from 'dayjs';
import { FunctionComponent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CustomizedModal from '../../components/customizedModal/CustomizedModal';
import RescheduleAppointment from '../../components/forms/RescheduleAppointment';
import { EventType } from '../../events/eventTypes';
import { eventEmitter } from '../../events/events';
import IAppointmentHistoryResponse from '../../types/appointments_api/responses/IAppointmentHistoryResponse';
import { ModalNames } from '../../types/common/ModalNames';
import IPagedResponse from '../../types/common/responses/IPagedResponse';

interface PatientHistoryProps {
    appointments: IPagedResponse<IAppointmentHistoryResponse>;
    setAppointments: React.Dispatch<React.SetStateAction<IPagedResponse<IAppointmentHistoryResponse>>>;
    handlePageChange: (e: React.MouseEvent<HTMLButtonElement, MouseEvent> | null, page: number) => Promise<void>;
}

const PatientHistory: FunctionComponent<PatientHistoryProps> = ({ appointments, setAppointments, handlePageChange }) => {
    const [rescheduleAppointmentId, setRescheduleAppointmentId] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const closeRescheduleAppointmentModel = () => {
            setRescheduleAppointmentId(null);
        };

        eventEmitter.addListener(`${EventType.SUBMIT_DIALOG} ${ModalNames.RescheduleAppointment}`, closeRescheduleAppointmentModel);

        return () => {
            eventEmitter.removeListener(`${EventType.SUBMIT_DIALOG} ${ModalNames.RescheduleAppointment}`, closeRescheduleAppointmentModel);
        };
    }, []);

    return (
        <>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} size='small'>
                    <TableHead>
                        <TableRow>
                            <TableCell align='center'>Date</TableCell>
                            <TableCell align='center'>Time</TableCell>
                            <TableCell align='center'>Doctor full name</TableCell>
                            <TableCell align='center'>Service</TableCell>
                            <TableCell align='center'>Manage</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {appointments.items.map((item, index) => (
                            <TableRow key={index} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                <TableCell align='center' component='th'>
                                    {dayjs(item.date).format('DD MMMM YYYY')}
                                </TableCell>
                                <TableCell align='center'>{`${item.startTime.format('HH:mm')} - ${item.endTime.format(
                                    'HH:mm'
                                )}`}</TableCell>
                                <TableCell align='center'>{item.doctorFullName}</TableCell>
                                <TableCell align='center'>{item.serviceName}</TableCell>
                                <TableCell align='center'>
                                    {item.resultId ? (
                                        <Button onClick={() => navigate(`appointments/results/${item.resultId}`)}>View result</Button>
                                    ) : (
                                        <Button disabled={item.isApproved} onClick={() => setRescheduleAppointmentId(item.id)}>
                                            Reschedule
                                        </Button>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                component='div'
                count={appointments.totalCount}
                rowsPerPage={appointments.pageSize}
                page={appointments.currentPage - 1}
                rowsPerPageOptions={[]}
                onPageChange={handlePageChange}
            />

            <CustomizedModal isOpen={rescheduleAppointmentId !== null} name={`${ModalNames.RescheduleAppointment}`}>
                <RescheduleAppointment id={rescheduleAppointmentId ?? ''} />
            </CustomizedModal>
        </>
    );
};

export default PatientHistory;
