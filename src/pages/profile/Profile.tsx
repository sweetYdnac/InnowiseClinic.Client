import Button from '@mui/material/Button';
import { FunctionComponent, useState } from 'react';
import PatientsService from '../../services/PatientsService';
import AuthorizationService from '../../services/AuthorizationService';
import IProfileResponse from '../../types/profile/response/IProfileResponse';
import Box from '@mui/material/Box';
import CustomTextField from '../../components/CustomTextField';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import DatePicker from 'react-datepicker';

export type WorkMode = 'view' | 'edit';

interface ProfileProps {
    workMode?: WorkMode;
}

const validationSchema = yup.object().shape({
    firstName: yup.string().required('Please, enter a first name'),
    lastName: yup.string().required('Please, enter a first name'),
    middleName: yup.string().notRequired(),
    dateOfBirth: yup.string().required('Please, select the date'),
    phoneNumber: yup
        .string()
        .matches(/^\d+$/, `You've entered an invalid phone number`)
        .required('Please, enter a phone number'),
    photoId: yup.string().notRequired().uuid('Entered accound id not a uuid'),
});

const Profile: FunctionComponent<ProfileProps> = ({ workMode = 'view' }) => {
    const [mode, setWorkMode] = useState(workMode);

    const {
        register,
        handleSubmit,
        formState: { errors, touchedFields },
        reset,
    } = useForm<IProfileResponse>({
        mode: 'onBlur',
        resolver: yupResolver(validationSchema),
        defaultValues: async () => {
            return (
                await PatientsService.getById(
                    AuthorizationService.getAccountId()
                )
            ).data;
        },
    });

    const switchWorkMode = () => {
        setWorkMode(mode === 'view' ? 'edit' : 'view');

        reset();
    };
    return (
        <>
            <Button onClick={switchWorkMode}>{mode}</Button>
            <Box
                // onSubmit={validator.handleSubmit}
                component={mode === 'view' ? 'div' : 'form'}
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
                <CustomTextField
                    workMode={mode}
                    displayName='First Name'
                    isTouched={touchedFields.firstName}
                    errors={errors.firstName?.message}
                    register={register('firstName')}
                />

                <CustomTextField
                    workMode={mode}
                    displayName='Last Name'
                    isTouched={touchedFields.lastName}
                    errors={errors.lastName?.message}
                    register={register('lastName')}
                />

                <CustomTextField
                    workMode={mode}
                    displayName='Middle Name'
                    isTouched={touchedFields.middleName}
                    errors={errors.middleName?.message}
                    register={register('middleName')}
                />

                <DatePicker />

                <Button variant='contained' component='label'>
                    Upload
                    <input hidden accept='image/*' multiple type='file' />
                </Button>
            </Box>
        </>
    );
};

export default Profile;
