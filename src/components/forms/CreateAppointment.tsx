import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Typography } from '@mui/material';
import { AxiosError } from 'axios';
import dayjs from 'dayjs';
import { FunctionComponent, useEffect, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import * as yup from 'yup';
import { EventType } from '../../events/eventTypes';
import { eventEmitter } from '../../events/events';
import AppointmentsService from '../../services/appointments_api/AppointmentsService';
import AuthorizationService from '../../services/authorization_api/AuthorizationService';
import OfficesService from '../../services/offices_api/OfficesService';
import DoctorsService from '../../services/profiles_api/DoctorsService';
import PatientsService from '../../services/profiles_api/PatientsService';
import ServicesService from '../../services/services_api/ServicesService';
import SpecializationsService from '../../services/services_api/SpecializationsService';
import ICreateAppointmentDTO from '../../types/appointments_api/ICreateAppointmentDTO';
import ITimeSlot from '../../types/appointments_api/ITimeSlot';
import ICreateAppointmentForm from '../../types/appointments_api/forms/ICreateAppointmentForm';
import ICreateAppointmentRequest from '../../types/appointments_api/requests/ICreateAppointmentRequest';
import IGetTimeSlotsRequest from '../../types/appointments_api/requests/IGetTimeSlotsRequest';
import IAutoCompleteItem from '../../types/common/IAutoCompleteItem';
import IGetPagedOfficesRequest from '../../types/offices_api/requests/IGetPagedOfficesRequest';
import IOfficeInformationResponse from '../../types/offices_api/responses/IOfficeInformationResponse';
import IGetPagedDoctorsRequest from '../../types/profiles_api/doctors/requests/IGetPagedDoctorsRequest';
import IDoctorInformationResponse from '../../types/profiles_api/doctors/responses/IDoctorInformationResponse';
import IGetPagedServicesRequest from '../../types/services_api/requests/service/IGetPagedServicesRequest';
import IGetPagedSpecializationsRequest from '../../types/services_api/requests/specialization/IGetPagedSpecializationsRequest';
import IServiceInformationResponse from '../../types/services_api/responses/service/IServiceInformationResponse';
import ISpecializationResponse from '../../types/services_api/responses/specialization/ISpecializationResponse';
import AutoComplete from '../AutoComplete';
import Datepicker from '../CustomDatePicker';
import CustomDialog from '../CustomDialog';
import { PopupData } from '../Popup';
import SubmitButton from '../SubmitButton';
import TimePicker from '../TimePicker';

const validationSchema = yup.object().shape({
    officeId: yup.mixed<string>().required('Please, choose the office'),
    doctorId: yup.mixed<string>().required('Please, choose the doctor'),
    specializationId: yup.mixed<string>().required('Please, choose the specialization'),
    serviceId: yup.mixed<string>().required('Please, choose the service'),
    date: yup.date().required('Please, enter a valid date').typeError('Please, enter a valid date'),
    time: yup.mixed<ITimeSlot>().required('Please, enter a valid timeslot'),
});

interface CreateAppointmentProps {
    modalName: string;
    dto?: ICreateAppointmentDTO;
}

const CreateAppointment: FunctionComponent<CreateAppointmentProps> = ({ modalName, dto }: CreateAppointmentProps) => {
    const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
    const [options, setOptions] = useState({
        offices: [] as IOfficeInformationResponse[],
        specializations: [] as ISpecializationResponse[],
        doctors: [] as IDoctorInformationResponse[],
        services: [] as IServiceInformationResponse[],
    });
    const [timeSlots, setTimeSlots] = useState<ITimeSlot[]>([]);
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        setError,
        setValue,
        getValues,
        formState: { errors, touchedFields },
        control,
    } = useForm<ICreateAppointmentForm>({
        mode: 'onBlur',
        resolver: yupResolver(validationSchema),
        defaultValues: async () => {
            return {
                officeId: dto ? dto.officeId : null,
                doctorId: dto ? dto.doctorId : null,
                specializationId: dto ? dto.specializationId : null,
                serviceId: null,
                date: dayjs(),
                time: null,
            } as ICreateAppointmentForm;
        },
    });

    const onSubmit = async (data: ICreateAppointmentForm) => {
        try {
            const patient = await PatientsService.getById(AuthorizationService.getAccountId());

            if (!patient.isActive) {
                navigate('/profile');
                eventEmitter.emit(`${EventType.SHOW_POPUP}`, {
                    message: 'Your profile does not configured.',
                    color: 'error',
                } as PopupData);

                eventEmitter.emit(`${EventType.CLOSE_MODAL} ${modalName}`);
                return;
            }

            const doctor = options.doctors.find((item) => item.id === data.doctorId);
            const service = options.services.find((item) => item.id === data.serviceId);

            const request = {
                patientId: AuthorizationService.getAccountId(),
                patientFullName: `${patient.firstName} ${patient.lastName} ${patient.middleName}`,
                patientPhoneNumber: patient.phoneNumber,
                patientDateOfBirth: patient.dateOfBirth.format('YYYY-MM-DD'),
                doctorId: data.doctorId,
                doctorFullName: doctor?.fullName,
                specializationId: doctor?.specializationId,
                doctorSpecializationName: doctor?.specializationName,
                serviceId: data.serviceId,
                serviceName: service?.title,
                duration: service?.duration,
                officeId: data.officeId,
                officeAddress: doctor?.officeAddress,
                date: dayjs(data.date).format('YYYY-MM-DD'),
                time: dayjs(data.time).format('HH:mm:ss'),
            } as ICreateAppointmentRequest;

            await AppointmentsService.create(request).then((response) => {
                eventEmitter.emit(`${EventType.SHOW_POPUP}`, {
                    message: 'Appointment created successfully!',
                    color: 'success',
                } as PopupData);

                eventEmitter.emit(`${EventType.CLOSE_MODAL} ${modalName}`);
            });
        } catch (error) {
            if (error instanceof AxiosError && error.response?.status === 400) {
                setError('officeId', {
                    message: error.response.data.errors?.OfficeId?.[0] || error.response.data.Message || '',
                });
                setError('specializationId', {
                    message: error.response.data.errors?.DoctorSpecializationName?.[0] || error.response.data.Message || '',
                });
                setError('doctorId', {
                    message:
                        error.response.data.errors?.DoctorId?.[0] ||
                        error.response.data.errors?.DoctorFullName?.[0] ||
                        error.response.data.errors?.DoctorSpecializationName?.[0] ||
                        error.response.data.Message ||
                        '',
                });
                setError('serviceId', {
                    message:
                        error.response.data.errors?.ServiceId?.[0] ||
                        error.response.data.errors?.ServiceName?.[0] ||
                        error.response.data.errors?.Duration?.[0] ||
                        error.response.data.Message ||
                        '',
                });
                setError('date', {
                    message: error.response.data.errors?.Date?.[0] || error.response.data.Message || '',
                });
                setError('time', {
                    message: error.response.data.errors?.Time?.[0] || error.response.data.Message || '',
                });

                if (error.response.data.errors?.PatientFullName?.[0]) {
                    eventEmitter.emit(`${EventType.SHOW_POPUP}`, {
                        message: error.response.data.errors?.PatientFullName?.[0],
                    } as PopupData);
                }
                if (error.response.data.errors?.PatientPhoneNumber?.[0]) {
                    eventEmitter.emit(`${EventType.SHOW_POPUP}`, {
                        message: error.response.data.errors?.PatientPhoneNumber?.[0],
                    } as PopupData);
                }
                if (error.response.data.errors?.PatientDateOfBirth?.[0]) {
                    eventEmitter.emit(`${EventType.SHOW_POPUP}`, {
                        message: error.response.data.errors?.PatientDateOfBirth?.[0],
                    } as PopupData);
                }
            }
        }
    };

    const watchService = useWatch({
        control,
        name: 'serviceId',
    });
    const watchDate = useWatch({
        control,
        name: 'date',
    });
    useEffect(() => {
        setValue('time', null, { shouldValidate: true });
    }, [watchService, watchDate, setValue]);

    useEffect(() => {
        if (options.doctors.length === 0 || !getValues('doctorId') || watchService === null || watchDate === null || !watchDate.isValid()) {
            setValue('time', null);
            setTimeSlots([]);
        }
    }, [options.doctors, watchDate, watchService]);

    useEffect(() => {
        const openCancelDialog = () => setIsCancelDialogOpen(true);
        const closeCancelDialog = () => setIsCancelDialogOpen(false);

        const handleOpenTimePicker = async () => {
            if (
                (options.doctors.length > 0 || getValues('doctorId')) &&
                watchService !== null &&
                watchDate !== null &&
                watchDate.isValid()
            ) {
                const request = async () => {
                    const data = {
                        date: getValues('date').format('YYYY-MM-DD'),
                        doctors: getValues('doctorId') ? getValues('doctorId') : options.doctors.map((item) => item.id),
                        duration: options.services.find((item) => item.id === getValues('serviceId'))?.duration ?? 30,
                        startTime: '08:00',
                        endTime: '18:00',
                    } as IGetTimeSlotsRequest;

                    const response = await AppointmentsService.getTimeSlots(data);
                    setTimeSlots(response.timeSlots);
                };

                setValue('time', null, { shouldValidate: true });
                request();
            } else {
                setTimeSlots([]);
            }
        };

        const hangleTimeSlotChange = (time: dayjs.Dayjs) => {
            const slot = timeSlots.find((slot) => slot.time === time?.format('HH:mm'));

            setOptions({
                ...options,
                doctors: options.doctors.filter((item) => slot?.doctors.some((id) => item.id === id)),
            });
        };

        const getOffices = async () => {
            const data = {
                currentPage: 1,
                pageSize: 50,
            } as IGetPagedOfficesRequest;

            const offices = (await OfficesService.getPaged(data)).items;

            setOptions({
                ...options,
                offices: offices,
            });
        };

        const getSpecializations = async (value = '') => {
            let data = {
                currentPage: 1,
                pageSize: 50,
                isActive: true,
                title: value,
            } as IGetPagedSpecializationsRequest;

            let specializations = (await SpecializationsService.getPaged(data)).items;

            setOptions({
                ...options,
                specializations: specializations,
            });
        };

        const onSpecializationChange = async () => {
            const specialization = options.specializations.find((item) => item.id === getValues('specializationId'));

            if (!specialization) {
                setValue('serviceId', null, { shouldValidate: true });
                setValue('doctorId', null, { shouldValidate: true });
            }
        };

        const getDoctors = async (value = '') => {
            if (getValues('time') !== null) {
                return;
            }

            const data = {
                currentPage: 1,
                pageSize: 50,
                onlyAtWork: true,
                officeId: getValues('officeId') ?? '',
                specializationId: getValues('specializationId') ?? '',
                fullName: value,
            } as IGetPagedDoctorsRequest;

            const doctors = (await DoctorsService.getPaged(data)).items;

            setOptions({
                ...options,
                doctors: doctors,
            });
        };

        const onDoctorChange = async () => {
            const doctor = options.doctors.find((item) => item.id === getValues('doctorId'));

            if (doctor?.specializationId && getValues('specializationId') === null) {
                const specialization = await SpecializationsService.getById(doctor?.specializationId);

                setOptions({
                    ...options,
                    specializations: [specialization],
                });
                setValue('specializationId', specialization.id, { shouldTouch: true, shouldValidate: true });
            }
        };

        const getServices = async (value = '') => {
            const data = {
                currentPage: 1,
                pageSize: 50,
                isActive: true,
                specializationId: getValues('specializationId') ?? '',
                title: value,
            } as IGetPagedServicesRequest;

            const services = (await ServicesService.getPaged(data)).items;

            setOptions({
                ...options,
                services: services,
            });
        };

        const onServiceChange = async () => {
            const service = options.services.find((item) => item.id === getValues('serviceId'));

            if (!service) {
                await getServices();
                setValue('time', null);
            } else {
                if (service?.specializationId && getValues('specializationId') === null) {
                    const specialization = await SpecializationsService.getById(service?.specializationId);

                    setOptions({
                        ...options,
                        specializations: [specialization],
                    });
                    setValue('specializationId', specialization.id, { shouldTouch: true, shouldValidate: true });
                }
            }
        };

        eventEmitter.addListener(`${EventType.CLICK_CLOSE_MODAL} ${modalName}`, openCancelDialog);
        eventEmitter.addListener(`${EventType.DECLINE_DIALOG} ${modalName}`, closeCancelDialog);

        eventEmitter.addListener(`${EventType.OPEN_TIMEPICKER} ${register('time').name}`, handleOpenTimePicker);
        eventEmitter.addListener(`${EventType.TIMEPICKER_VALUE_CHANGE} ${register('time').name}`, hangleTimeSlotChange);

        eventEmitter.addListener(`${EventType.OPEN_AUTOCOMPLETE} ${register('officeId').name}`, getOffices);

        eventEmitter.addListener(`${EventType.OPEN_AUTOCOMPLETE} ${register('specializationId').name}`, getSpecializations);
        eventEmitter.addListener(`${EventType.AUTOCOMPLETE_INPUT_CHANGE} ${register('specializationId').name}`, getSpecializations);
        eventEmitter.addListener(`${EventType.AUTOCOMPLETE_VALUE_CHANGE} ${register('specializationId').name}`, onSpecializationChange);

        eventEmitter.addListener(`${EventType.OPEN_AUTOCOMPLETE} ${register('doctorId').name}`, getDoctors);
        eventEmitter.addListener(`${EventType.AUTOCOMPLETE_INPUT_CHANGE} ${register('doctorId').name}`, getDoctors);
        eventEmitter.addListener(`${EventType.AUTOCOMPLETE_VALUE_CHANGE} ${register('doctorId').name}`, onDoctorChange);

        eventEmitter.addListener(`${EventType.OPEN_AUTOCOMPLETE} ${register('serviceId').name}`, getServices);
        eventEmitter.addListener(`${EventType.AUTOCOMPLETE_INPUT_CHANGE} ${register('serviceId').name}`, getServices);
        eventEmitter.addListener(`${EventType.AUTOCOMPLETE_VALUE_CHANGE} ${register('serviceId').name}`, onServiceChange);

        return () => {
            eventEmitter.removeListener(`${EventType.CLICK_CLOSE_MODAL} ${modalName}`, openCancelDialog);
            eventEmitter.removeListener(`${EventType.DECLINE_DIALOG} ${modalName}`, closeCancelDialog);

            eventEmitter.removeListener(`${EventType.OPEN_TIMEPICKER} ${register('time').name}`, handleOpenTimePicker);
            eventEmitter.removeListener(`${EventType.TIMEPICKER_VALUE_CHANGE} ${register('time').name}`, hangleTimeSlotChange);

            eventEmitter.removeListener(`${EventType.OPEN_AUTOCOMPLETE} ${register('officeId').name}`, getOffices);

            eventEmitter.removeListener(`${EventType.OPEN_AUTOCOMPLETE} ${register('specializationId').name}`, getSpecializations);
            eventEmitter.removeListener(`${EventType.AUTOCOMPLETE_INPUT_CHANGE} ${register('specializationId').name}`, getSpecializations);
            eventEmitter.removeListener(
                `${EventType.AUTOCOMPLETE_VALUE_CHANGE} ${register('specializationId').name}`,
                onSpecializationChange
            );

            eventEmitter.removeListener(`${EventType.OPEN_AUTOCOMPLETE} ${register('doctorId').name}`, getDoctors);
            eventEmitter.removeListener(`${EventType.AUTOCOMPLETE_INPUT_CHANGE} ${register('doctorId').name}`, getDoctors);
            eventEmitter.removeListener(`${EventType.AUTOCOMPLETE_VALUE_CHANGE} ${register('doctorId').name}`, onDoctorChange);

            eventEmitter.removeListener(`${EventType.OPEN_AUTOCOMPLETE} ${register('serviceId').name}`, getServices);
            eventEmitter.removeListener(`${EventType.AUTOCOMPLETE_INPUT_CHANGE} ${register('serviceId').name}`, getServices);
            eventEmitter.removeListener(`${EventType.AUTOCOMPLETE_VALUE_CHANGE} ${register('serviceId').name}`, onServiceChange);
        };
    }, [getValues, modalName, options, register, setValue, timeSlots, watchDate, watchService]);

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
                    Create Appointment
                </Typography>

                <AutoComplete
                    id={register('officeId').name}
                    displayName='Office'
                    control={control}
                    options={options.offices.map((item) => {
                        return {
                            label: item.address,
                            id: item.id,
                        } as IAutoCompleteItem;
                    })}
                />

                <AutoComplete
                    disabled={!getValues('officeId')}
                    id={register('specializationId').name}
                    displayName='Specialization'
                    control={control}
                    options={options.specializations.map((item) => {
                        return {
                            label: item.title,
                            id: item.id,
                        } as IAutoCompleteItem;
                    })}
                />

                <AutoComplete
                    disabled={!getValues('officeId')}
                    id={register('doctorId').name}
                    displayName='Doctor'
                    control={control}
                    options={options.doctors.map((item) => {
                        return {
                            label: item.fullName,
                            id: item.id,
                        } as IAutoCompleteItem;
                    })}
                />

                <AutoComplete
                    disabled={!getValues('officeId')}
                    id={register('serviceId').name}
                    displayName='Service'
                    control={control}
                    options={options.services.map((item) => {
                        return {
                            label: item.title,
                            id: item.id,
                        } as IAutoCompleteItem;
                    })}
                />

                <Datepicker
                    readOnly={(options.doctors.length === 0 || !getValues('doctorId')) && !getValues('serviceId')}
                    disabled={(options.doctors.length === 0 || !getValues('doctorId')) && !getValues('serviceId')}
                    id={register('date').name}
                    displayName='Date'
                    control={control}
                    disableFuture={false}
                    disablePast={true}
                    openTo={'day'}
                />

                <TimePicker
                    readOnly={
                        (options.doctors.length === 0 && getValues('doctorId') === null) ||
                        getValues('serviceId') === null ||
                        !getValues('date')?.isValid()
                    }
                    disabled={
                        (options.doctors.length === 0 && getValues('doctorId') === null) ||
                        getValues('serviceId') === null ||
                        !getValues('date')?.isValid()
                    }
                    id={register('time').name}
                    displayName='Time slot'
                    control={control}
                    timeSlots={timeSlots}
                />

                <SubmitButton errors={errors} touchedFields={touchedFields}>
                    Create
                </SubmitButton>
            </Box>

            <CustomDialog
                isOpen={isCancelDialogOpen}
                name={modalName}
                title='Discard changes?'
                content='Do you really want to exit? Your appointment will not be saved.'
            />
        </>
    );
};

export default CreateAppointment;
