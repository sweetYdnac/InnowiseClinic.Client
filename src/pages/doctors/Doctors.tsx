import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Typography } from '@mui/material';
import { FunctionComponent, useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import * as yup from 'yup';
import AutoComplete from '../../components/AutoComplete';
import CardsGrid from '../../components/CardsGrid';
import CustomFormTextfield from '../../components/CustomTextField';
import Loader from '../../components/Loader';
import { PopupData } from '../../components/Popup';
import Paginator from '../../components/navigation/Paginator';
import { EventType } from '../../events/eventTypes';
import { eventEmitter } from '../../events/events';
import PhotosService from '../../services/documents_api/PhotosService';
import OfficesService from '../../services/offices_api/OfficesService';
import DoctorsService from '../../services/profiles_api/DoctorsService';
import SpecializationsService from '../../services/services_api/SpecializationsService';
import IAutoCompleteItem from '../../types/common/IAutoCompleteItem';
import ICard from '../../types/common/ICard';
import IPagination from '../../types/common/IPagingData';
import IGetPagedOfficesRequest from '../../types/offices_api/requests/IGetPagedOfficesRequest';
import IOfficeInformationResponse from '../../types/offices_api/responses/IOfficeInformationResponse';
import IDoctorInformationDTO from '../../types/profiles_api/doctors/IDoctorInformationDTO';
import IGetPagedDoctorsForm from '../../types/profiles_api/doctors/forms/IGetPagedDoctorsForm';
import IGetPagedDoctorsRequest from '../../types/profiles_api/doctors/requests/IGetPagedDoctorsRequest';
import IGetPagedSpecializationsRequest from '../../types/services_api/requests/specialization/IGetPagedSpecializationsRequest';
import ISpecializationResponse from '../../types/services_api/responses/specialization/ISpecializationResponse';

interface DoctorsProps {}

const validationSchema = yup.object().shape({
    currentPage: yup.number().moreThan(0, 'Page number should be greater than 0').required(),
    pageSize: yup.number().min(1).max(50).required(),
    onlyAtWork: yup.boolean().required().equals<boolean>([true]),
    officeId: yup.string().notRequired(),
    specializationId: yup.string().notRequired(),
    fullName: yup.string().notRequired(),
});

const Doctors: FunctionComponent<DoctorsProps> = () => {
    const { page } = useParams();
    const [isLoading, setIsLoading] = useState(false);
    const [options, setOptions] = useState({
        offices: [] as IAutoCompleteItem<IOfficeInformationResponse>[],
        specializations: [] as IAutoCompleteItem<ISpecializationResponse>[],
        doctors: [] as ICard<IDoctorInformationDTO>[],
    });
    const [pagination, setPagination] = useState<IPagination>({
        currentPage: parseInt(page ?? '1'),
        pageSize: 1,
        totalCount: 1,
        totalPages: 1,
    });

    const { register, setValue, getValues, control, watch } = useForm<IGetPagedDoctorsForm>({
        mode: 'onBlur',
        resolver: yupResolver(validationSchema),
        defaultValues: async () => {
            return {
                office: null,
                specialization: null,
                doctor: '',
            } as IGetPagedDoctorsForm;
        },
    });

    const getDoctors = useCallback(
        async (page = 1) => {
            setIsLoading(true);

            const data = getValues();
            const values = {
                currentPage: page,
                pageSize: pagination?.pageSize,
                onlyAtWork: true,
                officeId: data.office?.item.id ?? '',
                specializationId: data.specialization?.item.id ?? '',
                fullName: data.doctor,
            } as IGetPagedDoctorsRequest;

            try {
                const response = await DoctorsService.getPaged(values);
                const { items, ...pagingData } = response;

                setPagination(pagingData);

                setOptions({
                    ...options,
                    doctors: await Promise.all(
                        items.map(async (item) => {
                            let photo = await PhotosService.getById(item.photoId);

                            return {
                                id: item.id,
                                title: item.fullName,
                                subtitle: item.specializationName,
                                photo: photo,
                                content: (
                                    <>
                                        <p>Experience - {item.experience}</p>
                                        <p>Office address - {item.officeAddress}.</p>
                                    </>
                                ),
                                dto: {
                                    photo: photo,
                                    fullName: item.fullName,
                                    officeId: item.officeId,
                                    officeAddress: item.officeAddress,
                                    experience: item.experience,
                                    specialization: item.specializationName,
                                    specializationId: item.specializationId,
                                },
                            } as ICard<IDoctorInformationDTO>;
                        })
                    ),
                });
            } catch (error) {
                eventEmitter.emit(`${EventType.SHOW_POPUP}`, {
                    message: 'Unexpected error occured.',
                } as PopupData);
            }

            setIsLoading(false);
        },
        [getValues, options, pagination?.pageSize]
    );

    const handlePageChange = async (page: number) => {
        setPagination({
            ...pagination,
            currentPage: page,
        });

        await getDoctors(page);
    };

    useEffect(() => {
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

        eventEmitter.addListener(`${EventType.OPEN_AUTOCOMPLETE} ${register('office').name}`, getOffices);
        eventEmitter.addListener(`${EventType.OPEN_AUTOCOMPLETE} ${register('specialization').name}`, getSpecializations);
        eventEmitter.addListener(`${EventType.AUTOCOMPLETE_INPUT_CHANGE} ${register('specialization').name}`, getSpecializations);

        return () => {
            eventEmitter.removeListener(`${EventType.OPEN_AUTOCOMPLETE} ${register('office').name}`, getOffices);
            eventEmitter.removeListener(`${EventType.OPEN_AUTOCOMPLETE} ${register('specialization').name}`, getSpecializations);
            eventEmitter.removeListener(`${EventType.AUTOCOMPLETE_INPUT_CHANGE} ${register('specialization').name}`, getSpecializations);
        };
    }, [getValues, options, register, setValue]);

    useEffect(() => {
        const subscription = watch(() => getDoctors());

        return () => subscription.unsubscribe();
    }, [getDoctors, watch]);

    return (
        <Box component={'div'} sx={{ display: 'flex', flexDirection: 'column' }}>
            <Box component={'form'} sx={{ display: 'flex', flexDirection: 'row' }}>
                <CustomFormTextfield
                    id={register('doctor').name}
                    control={control}
                    workMode={'edit'}
                    displayName='Doctor name'
                    inputMode='text'
                />
                <AutoComplete id={register('office').name} displayName='Office' control={control} options={options.offices} />
                <AutoComplete
                    id={register('specialization').name}
                    displayName='Specialization'
                    control={control}
                    options={options.specializations}
                />
            </Box>
            <Box>
                {!isLoading ? (
                    <>
                        {options.doctors.length === 0 ? (
                            <Typography>Doctors with selected filters does not exist.</Typography>
                        ) : (
                            <>
                                <CardsGrid items={options.doctors} />
                                <Paginator data={pagination} handleChange={(e, value) => handlePageChange(value)} />
                            </>
                        )}
                    </>
                ) : (
                    <Loader isOpen={isLoading} />
                )}
            </Box>
        </Box>
    );
};

export default Doctors;
