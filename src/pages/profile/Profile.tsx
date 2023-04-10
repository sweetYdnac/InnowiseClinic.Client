import Button from '@mui/material/Button';
import { FunctionComponent, useState } from 'react';
import PatientsService from '../../services/PatientsService';
import AuthorizationService from '../../services/AuthorizationService';
import IProfileResponse from '../../types/profile/response/IProfileResponse';
import Box from '@mui/material/Box';
import CustomTextField from '../../components/CustomTextField';
import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Datepicker from '../../components/Date_Picker';

export type WorkMode = 'view' | 'edit';

interface ProfileProps {
    workMode?: WorkMode;
}

const validationSchema = yup.object().shape({
    firstName: yup.string().required('Please, enter a first name'),
    lastName: yup.string().required('Please, enter a first name'),
    middleName: yup.string().notRequired(),
    dateOfBirth: yup.date().required('Please, select the date'),
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
        control,
        getValues,
    } = useForm<IProfileResponse>({
        mode: 'onBlur',
        resolver: yupResolver(validationSchema),
        defaultValues: async () => {
            return await PatientsService.getById(
                AuthorizationService.getAccountId()
            );
        },
    });

    const switchWorkMode = () => {
        setWorkMode(mode === 'view' ? 'edit' : 'view');

        reset();
    };

    return (
        <>
            {JSON.stringify(getValues()) !== JSON.stringify({}) && (
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

                        {/* <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <Controller
                                name='dateOfBirth'
                                control={control}
                                render={({ field }) => (
                                    <>
                                        <DatePicker
                                            // readOnly
                                            disableFuture
                                            label='Date of Birth'
                                            views={['year', 'month', 'day']}
                                            openTo='year'
                                            format='DD MMMM YYYY'
                                            {...field}
                                            defaultValue={field.value}
                                            value={field.value}
                                            onChange={(date) =>
                                                field.onChange(date)
                                            }
                                            onAccept={() => field.onBlur()}
                                            slotProps={{
                                                textField: {
                                                    variant: 'standard',
                                                    helperText:
                                                        'MM / DD / YYYY',
                                                },
                                            }}
                                        />
                                    </>
                                )}
                            />
                        </LocalizationProvider> */}

                        <Datepicker
                            workMode={mode}
                            id={register('dateOfBirth').name}
                            displayName='Date of Birth'
                            isTouched={!!touchedFields.dateOfBirth}
                            errors={errors.dateOfBirth?.message}
                            control={control}
                        />

                        <Button variant='contained' component='label'>
                            Upload
                            <input
                                hidden
                                accept='image/*'
                                multiple
                                type='file'
                            />
                        </Button>
                    </Box>
                </>
            )}
        </>
    );
};

export default Profile;
