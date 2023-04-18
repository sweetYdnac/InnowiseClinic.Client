import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Button, Typography } from '@mui/material';
import { AxiosError } from 'axios';
import dayjs from 'dayjs';
import { FunctionComponent, useEffect, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import * as yup from 'yup';
import { EventType } from '../../events/eventTypes';
import { eventEmitter } from '../../events/events';
import AppointmentsService from '../../services/AppointmentsService';
import AuthorizationService from '../../services/AuthorizationService';
import DoctorsService from '../../services/DoctorsService';
import OfficesService from '../../services/OfficesService';
import PatientsService from '../../services/PatientsService';
import ServicesService from '../../services/ServicesService';
import SpecializationsService from '../../services/SpecializationsService';
import ITimeSlot from '../../types/appointment/ITimeSlot';
import ICreateAppointmentForm from '../../types/appointment/forms/ICreateAppointmentForm';
import ICreateAppointmentRequest from '../../types/appointment/requests/ICreateAppointmentRequest';
import IGetTimeSlotsRequest from '../../types/appointment/requests/IGetTimeSlotsRequest';
import IAutoCompleteItem from '../../types/common/IAutoCompleteItem';
import IGetPagedDoctorsRequest from '../../types/doctors_api/requests/IGetPagedDoctorsRequest';
import IDoctorInformationResponse from '../../types/doctors_api/responses/IDoctorInformationResponse';
import IGetPagedOfficesRequest from '../../types/offices_api/requests/IGetPagedOfficesRequest';
import IOfficeInformationResponse from '../../types/offices_api/responses/IOfficeInformationResponse';
import IGetPagedServicesRequest from '../../types/services_api/requests/service/IGetPagedServicesRequest';
import IGetPagedSpecializationsRequest from '../../types/services_api/requests/specialization/IGetPagedSpecializationsRequest';
import IServiceInformationResponse from '../../types/services_api/responses/service/IServiceInformationResponse';
import ISpecializationResponse from '../../types/services_api/responses/specialization/ISpecializationResponse';
import AutoComplete from '../AutoComplete';
import CustomDialog from '../CustomDialog';
import Datepicker from '../CustomDatePicker';
import { PopupData } from '../Popup';
import TimePicker from '../TimePicker';

const validationSchema = yup.object().shape({
    office: yup.mixed<IAutoCompleteItem<IOfficeInformationResponse>>().required('Please, choose the office'),
    doctor: yup.mixed<IAutoCompleteItem<IDoctorInformationResponse>>().required('Please, choose the doctor'),
    specialization: yup.mixed<IAutoCompleteItem<ISpecializationResponse>>().required('Please, choose the specialization'),
    service: yup.mixed<IAutoCompleteItem<IServiceInformationResponse>>().required('Please, choose the service'),
    date: yup.date().required('Please, enter a valid date').typeError('Please, enter a valid date'),
    time: yup.mixed<ITimeSlot>().required('Please, enter a valid timeslot'),
});

interface CreateAppointmentProps {
    modalName: string;
}

const CreateAppointment: FunctionComponent<CreateAppointmentProps> = ({ modalName }: CreateAppointmentProps) => {
    const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
    const [options, setOptions] = useState({
        offices: [] as IAutoCompleteItem<IOfficeInformationResponse>[],
        specializations: [] as IAutoCompleteItem<ISpecializationResponse>[],
        doctors: [] as IAutoCompleteItem<IDoctorInformationResponse>[],
        services: [] as IAutoCompleteItem<IServiceInformationResponse>[],
    });
    const [timeSlots, setTimeSlots] = useState<ITimeSlot[]>([]);

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
                office: null,
                doctor: null,
                specialization: null,
                service: null,
                date: dayjs(),
                time: null,
            } as ICreateAppointmentForm;
        },
    });

    const onSubmit = async (data: ICreateAppointmentForm) => {
        try {
            let patient = await PatientsService.getById(AuthorizationService.getAccountId());

            let request = {
                patientId: AuthorizationService.getAccountId(),
                patientFullName: `${patient.firstName} ${patient.lastName} ${patient.middleName}`,
                patientPhoneNumber: patient.phoneNumber,
                patientDateOfBirth: patient.dateOfBirth.format('YYYY-MM-DD'),
                doctorId: data.doctor?.item.id,
                doctorFullName: data.doctor?.item.fullName,
                doctorSpecializationName: data.doctor?.item.specializationName,
                serviceId: data.service?.item.id,
                serviceName: data.service?.item.title,
                duration: data.service?.item.duration,
                officeId: data.office?.item.id,
                date: dayjs(data.date).format('YYYY-MM-DD'),
                time: dayjs(data.time?.parsedTime).format('HH:mm:ss'),
            } as ICreateAppointmentRequest;

            await AppointmentsService.create(request).then(() =>
                eventEmitter.emit(`${EventType.SHOW_POPUP}`, {
                    message: 'Appointment created successfully',
                    color: 'success',
                } as PopupData)
            );
            eventEmitter.emit(`${EventType.CLOSE_MODAL} ${modalName}`);
        } catch (error) {
            if (error instanceof AxiosError && error.response?.status === 400) {
                setError('office', {
                    message: error.response.data.errors?.OfficeId?.[0] || error.response.data.Message || '',
                });
                setError('specialization', {
                    message: error.response.data.errors?.DoctorSpecializationName?.[0] || error.response.data.Message || '',
                });
                setError('doctor', {
                    message:
                        error.response.data.errors?.DoctorId?.[0] ||
                        error.response.data.errors?.DoctorFullName?.[0] ||
                        error.response.data.errors?.DoctorSpecializationName?.[0] ||
                        error.response.data.Message ||
                        '',
                });
                setError('service', {
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
            console.log(error);
        }
    };

    const watchService = useWatch({
        control,
        name: 'service',
    });
    useEffect(() => {
        setValue('time', null, { shouldValidate: true });
    }, [watchService, setValue]);

    const watchDate = useWatch({
        control,
        name: 'date',
    });
    useEffect(() => {
        setValue('time', null, { shouldValidate: true });
    }, [watchDate, setValue]);

    useEffect(() => {
        if (options.doctors.length > 0 && watchService !== null && watchDate !== null && watchDate.isValid()) {
            const request = async () => {
                let data = {
                    date: getValues('date').format('YYYY-MM-DD'),
                    doctors: options.doctors.map((combobox) => combobox.item.id),
                    duration: getValues('service')?.item.duration ?? 30,
                    startTime: '08:00',
                    endTime: '18:00',
                } as IGetTimeSlotsRequest;

                let response = await AppointmentsService.getTimeSlots(data);
                setTimeSlots(response.timeSlots);
            };

            setValue('time', null);
            request();
        } else {
            setTimeSlots([]);
        }
    }, [options.doctors, watchService, watchDate, setValue, getValues]);

    useEffect(() => {
        const openCancelDialog = () => setIsCancelDialogOpen(true);
        const closeCancelDialog = () => setIsCancelDialogOpen(false);

        const setDoctorsFromTimeSlot = (data: ITimeSlot) =>
            setOptions({
                ...options,
                doctors: options.doctors.filter((combobox) => data.doctorsId.some((id) => id === combobox.item.id)),
            });

        const getOffices = async () => {
            let data = {
                currentPage: 1,
                pageSize: 50,
            } as IGetPagedOfficesRequest;

            let offices = (await OfficesService.getPaged(data)).items;

            setOptions({
                ...options,
                offices: offices.map((item) => {
                    return {
                        label: item.address,
                        item: item,
                    } as IAutoCompleteItem<IOfficeInformationResponse>;
                }),
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
                specializations: specializations.map((item) => {
                    return {
                        label: item.title,
                        item: item,
                    } as IAutoCompleteItem<ISpecializationResponse>;
                }),
            });
        };

        const onSpecializationChange = async () => {
            let specialization = getValues('specialization')?.item;

            if (!specialization) {
                setValue('service', null, { shouldValidate: true });
                setValue('doctor', null, { shouldValidate: true });
            }
        };

        const getDoctors = async (value = '') => {
            let data = {
                currentPage: 1,
                pageSize: 50,
                onlyAtWork: true,
                officeId: getValues('office')?.item.id ?? '',
                specializationId: getValues('specialization')?.item.id ?? '',
                fullName: value,
            } as IGetPagedDoctorsRequest;

            let doctors = (await DoctorsService.getPaged(data)).items;

            setOptions({
                ...options,
                doctors: doctors.map((item) => {
                    return {
                        label: item.fullName,
                        item: item,
                    } as IAutoCompleteItem<IDoctorInformationResponse>;
                }),
            });
        };

        const onDoctorChange = async () => {
            let doctor = getValues('doctor')?.item;

            if (doctor?.specializationId) {
                let specialization = await SpecializationsService.getById(doctor?.specializationId);

                setValue(
                    'specialization',
                    {
                        label: specialization.title,
                        item: specialization,
                    } as IAutoCompleteItem<ISpecializationResponse>,
                    { shouldTouch: true }
                );
            }
        };

        const getServices = async (value = '') => {
            let data = {
                currentPage: 1,
                pageSize: 50,
                isActive: true,
                specializationId: getValues('specialization')?.item.id ?? '',
                title: value,
            } as IGetPagedServicesRequest;

            let services = (await ServicesService.getPaged(data)).items;

            setOptions({
                ...options,
                services: services.map((item) => {
                    return {
                        label: item.title,
                        item: item,
                    } as IAutoCompleteItem<IServiceInformationResponse>;
                }),
            });
        };

        const onServiceChange = async () => {
            let service = getValues('service')?.item;

            if (!service) {
                await getServices();
                setValue('time', null);
            } else {
                if (service?.specializationId && getValues('specialization') === null) {
                    let specialization = await SpecializationsService.getById(service?.specializationId);

                    setValue(
                        'specialization',
                        {
                            label: specialization.title,
                            item: specialization,
                        } as IAutoCompleteItem<ISpecializationResponse>,
                        { shouldTouch: true }
                    );
                }
            }
        };

        eventEmitter.addListener(`${EventType.CLICK_CLOSE_MODAL} ${modalName}`, openCancelDialog);
        eventEmitter.addListener(`${EventType.DECLINE_DIALOG} ${modalName}`, closeCancelDialog);
        eventEmitter.addListener(`${EventType.ENTER_TIMESLOT}`, setDoctorsFromTimeSlot);

        eventEmitter.addListener(`${EventType.OPEN_AUTOCOMPLETE} ${register('office').name}`, getOffices);

        eventEmitter.addListener(`${EventType.OPEN_AUTOCOMPLETE} ${register('specialization').name}`, getSpecializations);
        eventEmitter.addListener(`${EventType.AUTOCOMPLETE_INPUT_CHANGE} ${register('specialization').name}`, getSpecializations);
        eventEmitter.addListener(`${EventType.AUTOCOMPLETE_VALUE_CHANGE} ${register('specialization').name}`, onSpecializationChange);

        eventEmitter.addListener(`${EventType.OPEN_AUTOCOMPLETE} ${register('doctor').name}`, getDoctors);
        eventEmitter.addListener(`${EventType.AUTOCOMPLETE_INPUT_CHANGE} ${register('doctor').name}`, getDoctors);
        eventEmitter.addListener(`${EventType.AUTOCOMPLETE_VALUE_CHANGE} ${register('doctor').name}`, onDoctorChange);

        eventEmitter.addListener(`${EventType.OPEN_AUTOCOMPLETE} ${register('service').name}`, getServices);
        eventEmitter.addListener(`${EventType.AUTOCOMPLETE_INPUT_CHANGE} ${register('service').name}`, getServices);
        eventEmitter.addListener(`${EventType.AUTOCOMPLETE_VALUE_CHANGE} ${register('service').name}`, onServiceChange);

        return () => {
            eventEmitter.removeListener(`${EventType.CLICK_CLOSE_MODAL} ${modalName}`, openCancelDialog);
            eventEmitter.removeListener(`${EventType.DECLINE_DIALOG} ${modalName}`, closeCancelDialog);
            eventEmitter.removeListener(`${EventType.ENTER_TIMESLOT}`, setDoctorsFromTimeSlot);

            eventEmitter.removeListener(`${EventType.OPEN_AUTOCOMPLETE} ${register('office').name}`, getOffices);

            eventEmitter.removeListener(`${EventType.OPEN_AUTOCOMPLETE} ${register('specialization').name}`, getSpecializations);
            eventEmitter.removeListener(`${EventType.AUTOCOMPLETE_INPUT_CHANGE} ${register('specialization').name}`, getSpecializations);
            eventEmitter.removeListener(
                `${EventType.AUTOCOMPLETE_VALUE_CHANGE} ${register('specialization').name}`,
                onSpecializationChange
            );

            eventEmitter.removeListener(`${EventType.OPEN_AUTOCOMPLETE} ${register('doctor').name}`, getDoctors);
            eventEmitter.removeListener(`${EventType.AUTOCOMPLETE_INPUT_CHANGE} ${register('doctor').name}`, getDoctors);
            eventEmitter.removeListener(`${EventType.AUTOCOMPLETE_VALUE_CHANGE} ${register('doctor').name}`, onDoctorChange);

            eventEmitter.removeListener(`${EventType.OPEN_AUTOCOMPLETE} ${register('service').name}`, getServices);
            eventEmitter.removeListener(`${EventType.AUTOCOMPLETE_INPUT_CHANGE} ${register('service').name}`, getServices);
            eventEmitter.removeListener(`${EventType.AUTOCOMPLETE_VALUE_CHANGE} ${register('service').name}`, onServiceChange);
        };
    }, [getValues, modalName, options, register, setValue]);

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
                    id={register('office').name}
                    displayName='Office'
                    isTouched={!!touchedFields.office}
                    errors={errors.office?.message}
                    control={control}
                    options={options.offices}
                />

                <AutoComplete
                    disabled={getValues('office') === null}
                    id={register('specialization').name}
                    displayName='Specialization'
                    isTouched={!!touchedFields.specialization}
                    errors={errors.specialization?.message}
                    control={control}
                    options={options.specializations}
                />

                <AutoComplete
                    disabled={getValues('office') === null}
                    id={register('doctor').name}
                    displayName='Doctor'
                    isTouched={!!touchedFields.doctor}
                    errors={errors.doctor?.message}
                    control={control}
                    options={options.doctors}
                />

                <AutoComplete
                    disabled={getValues('office') === null}
                    id={register('service').name}
                    displayName='Service'
                    isTouched={!!touchedFields.service}
                    errors={errors.service?.message}
                    control={control}
                    options={options.services}
                />

                <Datepicker
                    readOnly={options.doctors.length === 0 || getValues('service') === null}
                    disabled={options.doctors.length === 0 || getValues('service') === null}
                    id={register('date').name}
                    displayName='Date'
                    isTouched={!!touchedFields.date}
                    errors={errors.date?.message}
                    control={control}
                    disableFuture={false}
                    disablePast={true}
                    views={['year', 'month', 'day']}
                    openTo={'day'}
                />

                <TimePicker
                    readOnly={options.doctors.length === 0 || getValues('service') === null || !getValues('date').isValid()}
                    disabled={options.doctors.length === 0 || getValues('service') === null || !getValues('date').isValid()}
                    id={register('time').name}
                    displayName='Time slot'
                    isTouched={!!touchedFields.time}
                    errors={errors.time?.message}
                    control={control}
                    timeSlots={timeSlots}
                />

                <Button
                    type='submit'
                    variant='contained'
                    color='success'
                    disabled={
                        (errors.office?.message?.length ?? 0) > 0 ||
                        (errors.specialization?.message?.length ?? 0) > 0 ||
                        (errors.doctor?.message?.length ?? 0) > 0 ||
                        (errors.service?.message?.length ?? 0) > 0 ||
                        (errors.date?.message?.length ?? 0) > 0 ||
                        (errors.time?.message?.length ?? 0) > 0 ||
                        !touchedFields.office ||
                        !touchedFields.specialization ||
                        !touchedFields.doctor ||
                        !touchedFields.service ||
                        !touchedFields.date ||
                        !touchedFields.time
                    }
                >
                    Create
                </Button>
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
