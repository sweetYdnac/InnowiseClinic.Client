import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Typography } from '@mui/material';
import { AxiosError } from 'axios';
import dayjs from 'dayjs';
import { FunctionComponent, useCallback, useEffect, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import * as yup from 'yup';
import { EventType } from '../../events/eventTypes';
import { eventEmitter } from '../../events/events';
import AppointmentsService from '../../services/appointments_api/AppointmentsService';
import DoctorsService from '../../services/profiles_api/DoctorsService';
import ITimeSlot from '../../types/appointments_api/ITimeSlot';
import IRescheduleAppointmentForm from '../../types/appointments_api/forms/IRescheduleAppointmentForm';
import IGetTimeSlotsRequest from '../../types/appointments_api/requests/IGetTimeSlotsRequest';
import IRescheduleAppointmentRequest from '../../types/appointments_api/requests/IRescheduleAppointmentRequest';
import IRescheduleAppointmentResponse from '../../types/appointments_api/responses/IRescheduleAppointmentResponse';
import IAutoCompleteItem from '../../types/common/IAutoCompleteItem';
import { ModalNames } from '../../types/common/ModalNames';
import IGetPagedDoctorsRequest from '../../types/profiles_api/doctors/requests/IGetPagedDoctorsRequest';
import IDoctorInformationResponse from '../../types/profiles_api/doctors/responses/IDoctorInformationResponse';
import AutoComplete from '../AutoComplete';
import Datepicker from '../CustomDatePicker';
import CustomDialog from '../CustomDialog';
import { PopupData } from '../Popup';
import ReadonlyTextField from '../ReadonlyTextField';
import SubmitButton from '../SubmitButton';
import TimePicker from '../TimePicker';

const validationSchema = yup.object().shape({
    doctorId: yup.mixed<string>().required('Please, choose the doctor'),
    date: yup.date().required('Please, enter a valid date').typeError('Please, enter a valid date'),
    time: yup.mixed<ITimeSlot>().required('Please, enter a valid timeslot'),
});

interface RescheduleAppointmentProps {
    id: string;
}

const RescheduleAppointment: FunctionComponent<RescheduleAppointmentProps> = ({ id }) => {
    const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
    const [appointmentData, setAppointmentData] = useState<IRescheduleAppointmentResponse | null>(null);
    const [doctors, setDoctors] = useState([] as IDoctorInformationResponse[]);
    const [timeSlots, setTimeSlots] = useState<ITimeSlot[]>([]);
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        setError,
        setValue,
        getValues,
        reset,
        formState: { errors, touchedFields },
        control,
    } = useForm<IRescheduleAppointmentForm>({
        mode: 'onBlur',
        resolver: yupResolver(validationSchema),
    });

    const handleError = useCallback(
        (error: any) => {
            navigate('/');
            if (error instanceof AxiosError && error.status === 400) {
                eventEmitter.emit(`${EventType.SHOW_POPUP}`, {
                    message: 'Unknown error occurred',
                } as PopupData);
            }
        },
        [navigate]
    );

    const onSubmit = async (data: IRescheduleAppointmentForm) => {
        const doctor = doctors.find((item) => item.id === data.doctorId);

        const request = {
            doctorId: doctor?.id,
            doctorFullName: doctor?.fullName,
            date: dayjs(data.date).format('YYYY-MM-DD'),
            time: dayjs(data.time).format('HH:mm:ss'),
        } as IRescheduleAppointmentRequest;

        try {
            await AppointmentsService.reschedule(id, request).then(() =>
                eventEmitter.emit(`${EventType.SHOW_POPUP}`, {
                    message: 'Appointment rescheduled successfully!',
                    color: 'success',
                } as PopupData)
            );

            eventEmitter.emit(`${EventType.CLOSE_MODAL} ${ModalNames.RescheduleAppointment}`);
        } catch (error) {
            if (error instanceof AxiosError && error.response?.status === 400) {
                setError('doctorId', {
                    message: error.response.data.errors?.DoctorId?.[0] || error.response.data.errors?.DoctorFullName?.[0] || '',
                });
                setError('date', {
                    message: error.response.data.errors?.Date?.[0] || error.response.data.Message || '',
                });
                setError('time', {
                    message: error.response.data.errors?.Time?.[0] || error.response.data.Message || '',
                });
            }
        }
    };

    useEffect(() => {
        const getAppointment = async () => {
            try {
                const response = await AppointmentsService.getById(id);

                setDoctors([
                    {
                        id: response.doctorId,
                        fullName: response.doctorFullName,
                        specializationId: response.specializationId,
                        officeId: response.officeId,
                    } as IDoctorInformationResponse,
                ]);
                setAppointmentData(response);
                reset({
                    doctorId: response.doctorId,
                    date: dayjs(response.date, 'YYYY-MM-DD'),
                    time: dayjs(response.time, 'HH:mm'),
                } as IRescheduleAppointmentForm);
            } catch (error) {
                handleError(error);
            }
        };

        getAppointment();
    }, []);

    const watchDate = useWatch({
        control,
        name: 'date',
    });

    useEffect(() => {
        const openCancelDialog = () => setIsCancelDialogOpen(true);
        const closeCancelDialog = () => setIsCancelDialogOpen(false);

        const getDoctors = async (value = '') => {
            if (getValues('time') !== null) {
                return;
            }

            const data = {
                currentPage: 1,
                pageSize: 50,
                onlyAtWork: true,
                officeId: appointmentData?.officeId ?? '',
                specializationId: appointmentData?.specializationId ?? '',
                fullName: value,
            } as IGetPagedDoctorsRequest;

            try {
                setDoctors((await DoctorsService.getPaged(data)).items);
            } catch (error) {
                handleError(error);
            }
        };

        const clearTimeSlot = () => {
            setValue('time', null, { shouldValidate: true, shouldTouch: true });
            setTimeSlots([]);
        };

        const handleOpenTimePicker = async () => {
            if ((doctors.length > 0 || getValues('doctorId')) && watchDate !== null && watchDate.isValid()) {
                const getTimeSlots = async () => {
                    const data = {
                        date: getValues('date').format('YYYY-MM-DD'),
                        doctors: getValues('doctorId') ? getValues('doctorId') : doctors.map((item) => item.id),
                        duration: appointmentData?.duration,
                        startTime: '08:00',
                        endTime: '18:00',
                    } as IGetTimeSlotsRequest;

                    try {
                        const response = await AppointmentsService.getTimeSlots(data);
                        setTimeSlots(response.timeSlots);
                    } catch (error) {
                        handleError(error);
                    }
                };

                getTimeSlots();
            } else {
                setTimeSlots([]);
            }
        };

        const hangleTimeSlotChange = (time: dayjs.Dayjs) => {
            const slot = timeSlots.find((slot) => slot.time === time?.format('HH:mm'));
            setDoctors(doctors.filter((item) => slot?.doctors.some((id) => item.id === id)));
        };

        eventEmitter.addListener(`${EventType.CLICK_CLOSE_MODAL} ${ModalNames.RescheduleAppointment}`, openCancelDialog);
        eventEmitter.addListener(`${EventType.DECLINE_DIALOG} ${ModalNames.RescheduleAppointment}`, closeCancelDialog);

        eventEmitter.addListener(`${EventType.OPEN_AUTOCOMPLETE} ${register('doctorId').name}`, getDoctors);
        eventEmitter.addListener(`${EventType.AUTOCOMPLETE_INPUT_CHANGE} ${register('doctorId').name}`, getDoctors);

        eventEmitter.addListener(`${EventType.DATEPICKER_VALUE_CHANGE} ${register('date').name}`, clearTimeSlot);

        eventEmitter.addListener(`${EventType.OPEN_TIMEPICKER} ${register('time').name}`, handleOpenTimePicker);
        eventEmitter.addListener(`${EventType.TIMEPICKER_VALUE_CHANGE} ${register('time').name}`, hangleTimeSlotChange);

        return () => {
            eventEmitter.removeListener(`${EventType.CLICK_CLOSE_MODAL} ${ModalNames.RescheduleAppointment}`, openCancelDialog);
            eventEmitter.removeListener(`${EventType.DECLINE_DIALOG} ${ModalNames.RescheduleAppointment}`, closeCancelDialog);

            eventEmitter.removeListener(`${EventType.OPEN_AUTOCOMPLETE} ${register('doctorId').name}`, getDoctors);
            eventEmitter.removeListener(`${EventType.AUTOCOMPLETE_INPUT_CHANGE} ${register('doctorId').name}`, getDoctors);

            eventEmitter.removeListener(`${EventType.DATEPICKER_VALUE_CHANGE} ${register('date').name}`, clearTimeSlot);

            eventEmitter.removeListener(`${EventType.OPEN_TIMEPICKER} ${register('time').name}`, handleOpenTimePicker);
            eventEmitter.removeListener(`${EventType.TIMEPICKER_VALUE_CHANGE} ${register('time').name}`, hangleTimeSlotChange);
        };
    }, [
        appointmentData?.duration,
        appointmentData?.officeId,
        appointmentData?.specializationId,
        doctors,
        getValues,
        handleError,
        register,
        setValue,
        timeSlots,
        watchDate,
    ]);

    return (
        <>
            <Box
                onSubmit={handleSubmit(onSubmit)}
                component='form'
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                }}
                noValidate
                autoComplete='off'
            >
                <Typography variant='h5' gutterBottom>
                    Reschedule Appointment
                </Typography>

                <ReadonlyTextField displayName='Office' value={appointmentData?.officeAddress ?? ''} />
                <ReadonlyTextField displayName='Specialization' value={appointmentData?.doctorSpecializationName ?? ''} />
                <ReadonlyTextField displayName='Service' value={appointmentData?.serviceName ?? ''} />

                <AutoComplete
                    id={register('doctorId').name}
                    displayName='Doctor'
                    control={control}
                    options={doctors.map((item) => {
                        return {
                            label: item.fullName,
                            id: item.id,
                        } as IAutoCompleteItem;
                    })}
                />

                <Datepicker
                    readOnly={doctors.length === 0 || !getValues('doctorId')}
                    disabled={doctors.length === 0 || !getValues('doctorId')}
                    id={register('date').name}
                    displayName='Date'
                    control={control}
                    disableFuture={false}
                    disablePast={true}
                    openTo={'day'}
                />

                <TimePicker
                    readOnly={(doctors.length === 0 && getValues('doctorId') === null) || !getValues('date')?.isValid()}
                    disabled={(doctors.length === 0 && getValues('doctorId') === null) || !getValues('date')?.isValid()}
                    id={register('time').name}
                    displayName='Time slot'
                    control={control}
                    timeSlots={timeSlots}
                />

                <SubmitButton errors={errors} touchedFields={touchedFields}>
                    Save
                </SubmitButton>
            </Box>
            <CustomDialog
                isOpen={isCancelDialogOpen}
                name={ModalNames.RescheduleAppointment}
                title='Discard changes?'
                content='Do you really want to exit? Entered data won`t be saved.'
            />
        </>
    );
};

export default RescheduleAppointment;
