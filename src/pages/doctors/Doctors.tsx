import { yupResolver } from '@hookform/resolvers/yup';
import { Box } from '@mui/material';
import { FunctionComponent, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import CardsGrid from '../../components/CardsGrid';
import Loader from '../../components/Loader';
import DoctorsService from '../../services/DoctorsService';
import PhotosService from '../../services/PhotosService';
import IAutoCompleteItem from '../../types/common/IAutoCompleteItem';
import ICard from '../../types/common/ICard';
import IPagination from '../../types/common/IPagination';
import IGetPagedDoctorsRequest from '../../types/doctors_api/requests/IGetPagedDoctorsRequest';
import IDoctorInformationResponse from '../../types/doctors_api/responses/IDoctorInformationResponse';
import IOfficeInformationResponse from '../../types/offices_api/responses/IOfficeInformationResponse';
import ISpecializationResponse from '../../types/services_api/responses/specialization/ISpecializationResponse';
import { AxiosError } from 'axios';
import AutoComplete from '../../components/AutoComplete';

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
    const [options, setOptions] = useState({
        offices: [] as IAutoCompleteItem<IOfficeInformationResponse>[],
        specializations: [] as IAutoCompleteItem<ISpecializationResponse>[],
        doctors: [] as IAutoCompleteItem<IDoctorInformationResponse>[],
    });

    const [patination, setPatination] = useState<IPagination>();
    const [doctorsCards, setDoctorsCards] = useState<ICard[]>([]);

    const {
        register,
        handleSubmit,
        setError,
        setValue,
        getValues,
        formState: { errors, touchedFields },
        control,
    } = useForm<IGetPagedDoctorsRequest>({
        mode: 'onBlur',
        resolver: yupResolver(validationSchema),
        defaultValues: async () => {
            let defaultValues = {
                currentPage: 1,
                pageSize: 20,
                onlyAtWork: true,
                officeId: '',
                specializationId: '',
                fullName: '',
            } as IGetPagedDoctorsRequest;

            getDoctors(defaultValues);

            return defaultValues;
        },
    });

    const getDoctors = async (request?: IGetPagedDoctorsRequest) => {
        const values = request ?? getValues();

        const response = await DoctorsService.getPaged(values);
        const { items, ...pagingData } = response;

        setPatination(pagingData as IPagination);

        setDoctorsCards(
            await Promise.all(
                items.map(async (item) => {
                    return {
                        id: item.id,
                        title: item.fullName,
                        subtitle: item.specializationName,
                        photo: await PhotosService.getById(item.photoId),
                        content: (
                            <>
                                <p>Experience - {item.experience}</p>
                                <p>Office address - {item.officeAddress}.</p>
                            </>
                        ),
                    } as ICard;
                })
            )
        );
    };

    const onSubmit = async (data: IGetPagedDoctorsRequest) => {
        try {
            await getDoctors();
        } catch (error) {
            if (error instanceof AxiosError && error.response?.status === 400) {
            }
        }
    };

    return (
        <Box component={'div'} sx={{ display: 'flex', flexDirection: 'column' }}>
            <Box component={'form'} onSubmit={handleSubmit(onSubmit)} sx={{ display: 'flex', flexDirection: 'row' }}>
                {/* <AutoComplete
                    id={register('office').name}
                    displayName='Office'
                    isTouched={!!touchedFields.office}
                    errors={errors.office?.message}
                    control={control}
                    options={options.offices}
                /> */}
            </Box>
            <Box>{doctorsCards.length > 0 ? <CardsGrid items={doctorsCards} /> : <Loader isOpen={doctorsCards.length === 0} />}</Box>
        </Box>
    );
};

export default Doctors;
