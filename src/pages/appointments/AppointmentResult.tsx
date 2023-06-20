import { Box, Button, Typography } from '@mui/material';
import dayjs from 'dayjs';
import { FunctionComponent, useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Loader from '../../components/Loader';
import { PopupData } from '../../components/Popup';
import ReadonlyTextArea from '../../components/ReadonlyTextArea';
import ReadonlyTextField from '../../components/ReadonlyTextField';
import { EventType } from '../../events/eventTypes';
import { eventEmitter } from '../../events/events';
import AppointmentsResultsService from '../../services/appointments_api/AppointmentsResultsService';
import PdfResultsService from '../../services/documents_api/PdfResultsService';
import IAppointmentResultResponse from '../../types/appointments_api/responses/IAppointmentResultResponse';

interface AppointmentResultProps {}

const AppointmentResult: FunctionComponent<AppointmentResultProps> = () => {
    const { id } = useParams();
    const [data, setData] = useState<IAppointmentResultResponse | null>(null);
    const navigate = useNavigate();

    const handleError = useCallback(() => {
        navigate('/');
        eventEmitter.emit(`${EventType.SHOW_POPUP}`, {
            message: 'Unexpected error occured.',
        } as PopupData);
    }, [navigate]);

    const handleDownloadResult = async () => {
        try {
            const blob = await PdfResultsService.getById(id as string);
            console.log(blob);

            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${id}.pdf`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        } catch (error) {
            handleError();
        }
    };

    useEffect(() => {
        const getAppointmentResult = async () => {
            try {
                setData(await AppointmentsResultsService.getById(id as string));
            } catch (error) {
                handleError();
            }
        };

        getAppointmentResult();
    }, [handleError, id]);

    return (
        <>
            {data ? (
                <Box
                    component='div'
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '100%',
                    }}
                >
                    <Typography>Appointment result</Typography>
                    <ReadonlyTextField displayName='Date' value={dayjs(data?.date).format('DD MMMM YYYY')} />
                    <ReadonlyTextField displayName='Patient' value={data?.patientFullName as string} />
                    <ReadonlyTextField
                        displayName={`Patient's date of birth`}
                        value={dayjs(data?.patientDateOfBirth).format('DD MMMM YYYY')}
                    />
                    <ReadonlyTextField displayName='Doctor' value={data?.doctorFullName as string} />
                    <ReadonlyTextField displayName='Service' value={data?.serviceName as string} />
                    <ReadonlyTextArea displayName='Complaints' value={data.complaints} />
                    <ReadonlyTextArea displayName='Conclusions' value={data.conclusion} />
                    <ReadonlyTextArea displayName='Recommendations' value={data.recommendations} />
                    <Button variant='contained' onClick={handleDownloadResult}>
                        Download
                    </Button>
                </Box>
            ) : (
                <Loader isOpen={true} />
            )}
        </>
    );
};

export default AppointmentResult;
