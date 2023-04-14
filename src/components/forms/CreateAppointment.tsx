import { yupResolver } from '@hookform/resolvers/yup';
import { LocalizationProvider, StaticTimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { FunctionComponent, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { EventType } from '../../events/eventTypes';
import { eventEmitter } from '../../events/events';
import DoctorsService from '../../services/DoctorsService';
import OfficesService from '../../services/OfficesService';
import ServicesService from '../../services/ServicesService';
import SpecializationsService from '../../services/SpecializationsService';
import ITimeSlot from '../../types/appointment/ITimeSlot';
import ICreateAppointmentForm from '../../types/appointment/forms/ICreateAppointmentForm';
import IComboBoxItem from '../../types/common/IComboBoxItem';
import IGetPagedDoctorsRequest from '../../types/doctors_api/requests/IGetPagedDoctorsRequest';
import IDoctorInformationResponse from '../../types/doctors_api/responses/IDoctorInformationResponse';
import IGetPagedOfficesRequest from '../../types/offices_api/requests/IGetPagedOfficesRequest';
import IOfficeInformationResponse from '../../types/offices_api/responses/IOfficeInformationResponse';
import IGetPagedServicesRequest from '../../types/services_api/requests/service/IGetPagedServicesRequest';
import IGetPagedSpecializationsRequest from '../../types/services_api/requests/specialization/IGetPagedSpecializationsRequest';
import IServiceInformationResponse from '../../types/services_api/responses/service/IServiceInformationResponse';
import ISpecializationResponse from '../../types/services_api/responses/specialization/ISpecializationResponse';
import Combobox from '../Combo_box';
import CustomDialog from '../CustomDialog';
import Datepicker from '../Date_Picker';
import TimeSlots from '../TimeSlots';

const validationSchema = yup.object().shape({
    office: yup
        .mixed<IComboBoxItem<IOfficeInformationResponse>>()
        .required('Please, choose the office'),
    doctor: yup
        .mixed<IComboBoxItem<IDoctorInformationResponse>>()
        .required('Please, choose the doctor'),
    specialization: yup
        .mixed<IComboBoxItem<ISpecializationResponse>>()
        .required('Please, choose the specialization'),
    service: yup
        .mixed<IComboBoxItem<IServiceInformationResponse>>()
        .required('Please, choose the service'),
    date: yup
        .date()
        .required('Please, enter a valid date')
        .typeError('Please, enter a valid date'),

    time: yup
        .date()
        .required('Please, enter a valid timeslot')
        .typeError('Please, enter a valid timeslot'),
});

interface CreateAppointmentProps {
    modalName: string;
}

const CreateAppointment: FunctionComponent<CreateAppointmentProps> = ({
    modalName,
}: CreateAppointmentProps) => {
    const [doctorsId, setDoctorsId] = useState<string[]>([]);
    const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
    const [availableDoctorsId, setAvailableDoctorsId] = useState<string[]>([]);

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
                time: dayjs(),
            } as ICreateAppointmentForm;
        },
    });

    useEffect(() => {
        if (
            doctorsId.length === 0 ||
            getValues('service') === null ||
            !getValues('date').isValid()
        ) {
            setAvailableDoctorsId([]);
        }
    }, [doctorsId.length, getValues]);

    useEffect(() => {
        const handleCancelModal = () => {
            setIsCancelModalOpen(true);
        };

        const handleDeclineDialog = () => {
            setIsCancelModalOpen(false);
        };

        eventEmitter.addListener(
            `${EventType.CLICK_CLOSE_MODAL} ${modalName}`,
            handleCancelModal
        );
        eventEmitter.addListener(
            `${EventType.DECLINE_DIALOG} ${modalName}`,
            handleDeclineDialog
        );
        eventEmitter.addListener(
            `${EventType.ENTER_TIMESLOT}`,
            (data: ITimeSlot) => {
                setAvailableDoctorsId(data.doctorsId);
            }
        );

        return () => {
            eventEmitter.removeListener(
                `${EventType.CLICK_CLOSE_MODAL} ${modalName}`,
                handleCancelModal
            );
            eventEmitter.removeListener(
                `${EventType.DECLINE_DIALOG} ${modalName}`,
                handleDeclineDialog
            );
            eventEmitter.removeListener(
                `${EventType.ENTER_TIMESLOT}`,
                (data: ITimeSlot) => {
                    setAvailableDoctorsId(data.doctorsId);
                }
            );
        };
    }, [modalName]);

    const getOffices = async () => {
        let data = {
            currentPage: 1,
            pageSize: 50,
        } as IGetPagedOfficesRequest;

        let offices = (await OfficesService.getPaged(data)).items;

        return offices.map((item) => {
            return {
                label: item.address,
                value: item.id,
                item: item,
            } as IComboBoxItem<IOfficeInformationResponse>;
        });
    };

    const getSpecializations = async () => {
        let data = {
            currentPage: 1,
            pageSize: 50,
            isActive: true,
        } as IGetPagedSpecializationsRequest;

        return await fetchSpecializations(data);
    };

    const getSpecializationOnInputChange = async (
        e: React.SyntheticEvent<Element, Event>,
        value: string
    ) => {
        let data = {
            currentPage: 1,
            pageSize: 50,
            title: value,
            isActive: true,
        } as IGetPagedSpecializationsRequest;

        return await fetchSpecializations(data);
    };

    const fetchSpecializations = async (
        data: IGetPagedSpecializationsRequest
    ) => {
        let specializations = (await SpecializationsService.getPaged(data))
            .items;

        return specializations.map((item) => {
            return {
                label: item.title,
                value: item.id,
                item: item,
            } as IComboBoxItem<ISpecializationResponse>;
        });
    };

    const getDoctors = async () => {
        let data = {
            currentPage: 1,
            pageSize: 50,
            onlyAtWork: true,
            officeId: getValues('office')?.value ?? '',
            specializationId: getValues('specialization')?.value ?? '',
        } as IGetPagedDoctorsRequest;

        return await fetchDoctors(data);
    };

    const getDoctorsOnInputChange = async (
        e: React.SyntheticEvent<Element, Event>,
        value: string
    ) => {
        let data = {
            currentPage: 1,
            pageSize: 50,
            onlyAtWork: true,
            officeId: getValues('office')?.value ?? '',
            specializationId: getValues('specialization')?.value ?? '',
            fullName: value,
        } as IGetPagedDoctorsRequest;

        return await fetchDoctors(data);
    };

    const fetchDoctors = async (data: IGetPagedDoctorsRequest) => {
        let doctors = (await DoctorsService.getPaged(data)).items;

        if (availableDoctorsId.length > 0) {
            doctors = doctors.filter((item) =>
                availableDoctorsId.find((id) => id === item.id)
            );
        }

        setDoctorsId(
            doctors.map((item) => {
                return item.id;
            })
        );

        return doctors.map((item) => {
            return {
                label: item.fullName,
                value: item.id,
                item: item,
            } as IComboBoxItem<IDoctorInformationResponse>;
        });
    };

    const onDoctorChange = async () => {
        let doctor = getValues('doctor')?.item;

        if (doctor?.specializationId) {
            let specialization = await SpecializationsService.getById(
                doctor?.specializationId
            );

            setValue('specialization', {
                label: specialization.title,
                value: specialization.id,
                item: specialization,
            } as IComboBoxItem<ISpecializationResponse>);
        }
    };

    const getServices = async () => {
        let data = {
            currentPage: 1,
            pageSize: 50,
            isActive: true,
            specializationId: getValues('specialization')?.value ?? '',
        } as IGetPagedServicesRequest;

        return await fetchServices(data);
    };

    const getServicesOnInputChange = async (
        e: React.SyntheticEvent<Element, Event>,
        value: string
    ) => {
        let data = {
            currentPage: 1,
            pageSize: 50,
            isActive: true,
            specializationId: getValues('specialization')?.value ?? '',
            title: value,
        } as IGetPagedServicesRequest;

        return await fetchServices(data);
    };

    const fetchServices = async (data: IGetPagedServicesRequest) => {
        let services = (await ServicesService.getPaged(data)).items;

        return services.map((item) => {
            return {
                label: item.title,
                value: item.id,
                item: item,
            } as IComboBoxItem<IServiceInformationResponse>;
        });
    };

    const onServiceChange = async () => {
        let service = getValues('service')?.item;

        if (service?.specializationId && getValues('specialization') === null) {
            let specialization = await SpecializationsService.getById(
                service?.specializationId
            );

            setValue('specialization', {
                label: specialization.title,
                value: specialization.id,
                item: specialization,
            } as IComboBoxItem<ISpecializationResponse>);
        }
    };

    return (
        <>
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Combobox
                    id={register('office').name}
                    displayName='Office'
                    isTouched={!!touchedFields.office}
                    errors={errors.office?.message}
                    control={control}
                    getData={getOffices}
                />

                <Combobox
                    disabled={getValues('office') === null}
                    id={register('specialization').name}
                    displayName='Specialization'
                    isTouched={!!touchedFields.specialization}
                    errors={errors.specialization?.message}
                    control={control}
                    getData={getSpecializations}
                    getDataOnInputChange={getSpecializationOnInputChange}
                />

                <Combobox
                    disabled={getValues('office') === null}
                    id={register('doctor').name}
                    displayName='Doctor'
                    isTouched={!!touchedFields.doctor}
                    errors={errors.doctor?.message}
                    control={control}
                    getData={getDoctors}
                    getDataOnInputChange={getDoctorsOnInputChange}
                    onValueChange={onDoctorChange}
                />

                <Combobox
                    disabled={getValues('office') === null}
                    id={register('service').name}
                    displayName='Service'
                    isTouched={!!touchedFields.service}
                    errors={errors.service?.message}
                    control={control}
                    getData={getServices}
                    getDataOnInputChange={getServicesOnInputChange}
                    onValueChange={onServiceChange}
                />

                <Datepicker
                    readOnly={
                        doctorsId.length === 0 || getValues('service') === null
                    }
                    disabled={
                        doctorsId.length === 0 || getValues('service') === null
                    }
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

                <TimeSlots
                    isActive={
                        doctorsId.length > 0 &&
                        getValues('service') !== null &&
                        getValues('date').isValid()
                    }
                    date={getValues('date')}
                    doctors={doctorsId}
                    duration={getValues('service')?.item.duration ?? 30}
                />

                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <StaticTimePicker minutesStep={10} />
                </LocalizationProvider>
            </div>

            {isCancelModalOpen && (
                <CustomDialog
                    isOpen={isCancelModalOpen}
                    name={modalName}
                    title='Discard changes?'
                    content='Do you really want to exit? Your appointment will not be saved.'
                />
            )}
        </>
    );
};

export default CreateAppointment;
