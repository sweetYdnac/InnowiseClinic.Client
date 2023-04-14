import { yupResolver } from '@hookform/resolvers/yup';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { AxiosError } from 'axios';
import dayjs from 'dayjs';
import { FunctionComponent, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import CustomDialog from '../../components/CustomDialog';
import Datepicker from '../../components/Date_Picker';
import NumericTextfield from '../../components/NumericTextfield';
import PhotoDownload from '../../components/PhotoDownload';
import Textfield from '../../components/Textfield';
import { EventType } from '../../events/eventTypes';
import { eventEmitter } from '../../events/events';
import AuthorizationService from '../../services/AuthorizationService';
import DocumentsService from '../../services/DocumentsService';
import PatientsService from '../../services/PatientsService';
import { WorkMode } from '../../types/common/WorkMode';
import IUpdateProfileForm from '../../types/profile/IUpdateProfileForm';

const closeDialogEventName = 'updateProfile';

interface ProfileProps {
    workMode?: WorkMode;
}

const validationSchema = yup.object().shape({
    firstName: yup.string().required('Please, enter a first name'),
    lastName: yup.string().required('Please, enter a first name'),
    middleName: yup.string().notRequired(),
    dateOfBirth: yup
        .date()
        .required('Please, select the date')
        .typeError('Please, enter a valid date'),
    phoneNumber: yup
        .string()
        .required('Please, enter a phone number')
        .matches(/^\d+$/, `You've entered an invalid phone number`),
    photoId: yup.string().notRequired().uuid('Entered accound id not a uuid'),
    photo: yup.string().notRequired(),
});

const Profile: FunctionComponent<ProfileProps> = ({ workMode = 'view' }) => {
    const [mode, setWorkMode] = useState(workMode);
    const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        getValues,
        setError,
        formState: { errors, touchedFields, defaultValues },
        control,
    } = useForm<IUpdateProfileForm>({
        mode: 'onBlur',
        resolver: yupResolver(validationSchema),
        defaultValues: async () => {
            let { isActive, ...rest } = await PatientsService.getById(
                AuthorizationService.getAccountId()
            );

            let values = rest as IUpdateProfileForm;

            if (values.photoId) {
                let photo = await DocumentsService.getById(values.photoId);
                values.photo = photo;
            }

            return values;
        },
    });

    const enableEditMode = () => {
        setWorkMode('edit');
        reset();
    };

    const handleDeclineDialog = () => {
        setIsCancelModalOpen(false);
    };

    const onSubmit = async (data: IUpdateProfileForm) => {
        try {
            let { photoId, photo, dateOfBirth, ...rest } = data;

            const request = {
                ...rest,
                dateOfBirth: dayjs(dateOfBirth).format('YYYY-MM-DD'),
            };

            await PatientsService.updatePatient(
                AuthorizationService.getAccountId(),
                request
            );

            if (getValues('photo') !== defaultValues?.photo) {
                await DocumentsService.update(photoId, photo);
            }

            setWorkMode('view');
            reset({
                ...getValues(),
            });
        } catch (error) {
            if (error instanceof AxiosError && error.response?.status === 400) {
                console.log(error.response.data.errors);
                setError('firstName', {
                    message:
                        error.response.data.errors?.FirstName?.[0] ??
                        error.response.data.Message ??
                        '',
                });
                setError('lastName', {
                    message:
                        error.response.data.errors?.LastName?.[0] ??
                        error.response.data.Message ??
                        '',
                });
                setError('dateOfBirth', {
                    message:
                        error.response.data.errors?.dateOfBirth?.[0] ??
                        error.response.data.Message ??
                        '',
                });
                setError('phoneNumber', {
                    message:
                        error.response.data.errors?.PhoneNumber?.[0] ??
                        error.response.data.Message ??
                        '',
                });
            }
        }
    };

    useEffect(() => {
        const handleSubmitDialog = () => {
            reset();
            setWorkMode('view');
            setIsCancelModalOpen(false);
        };

        eventEmitter.addListener(
            `${EventType.DECLINE_DIALOG} ${closeDialogEventName}`,
            handleDeclineDialog
        );
        eventEmitter.addListener(
            `${EventType.SUBMIT_DIALOG} ${closeDialogEventName}`,
            handleSubmitDialog
        );

        return () => {
            eventEmitter.removeListener(
                `${EventType.DECLINE_DIALOG} ${closeDialogEventName}`,
                handleDeclineDialog
            );
            eventEmitter.removeListener(
                `${EventType.SUBMIT_DIALOG} ${closeDialogEventName}`,
                handleSubmitDialog
            );
        };
    }, [reset]);

    return (
        <>
            {JSON.stringify(getValues()) !== JSON.stringify({}) && (
                <>
                    {mode === 'view' && (
                        <Button onClick={enableEditMode}>Edit</Button>
                    )}
                    <Box
                        onSubmit={handleSubmit(onSubmit)}
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
                        <PhotoDownload
                            workMode={mode}
                            photo={getValues('photo')}
                            register={register('photo')}
                        />

                        <Textfield
                            workMode={mode}
                            displayName='First Name'
                            isTouched={Object.keys(touchedFields).length !== 0}
                            errors={errors.firstName?.message}
                            register={register('firstName')}
                        />

                        <Textfield
                            workMode={mode}
                            displayName='Last Name'
                            isTouched={Object.keys(touchedFields).length !== 0}
                            errors={errors.lastName?.message}
                            register={register('lastName')}
                        />

                        <Textfield
                            workMode={mode}
                            displayName='Middle Name'
                            isTouched={Object.keys(touchedFields).length !== 0}
                            errors={errors.middleName?.message}
                            register={register('middleName')}
                        />

                        <Datepicker
                            readOnly={mode === 'view'}
                            id={register('dateOfBirth').name}
                            displayName='Date of Birth'
                            isTouched={Object.keys(touchedFields).length !== 0}
                            errors={errors.dateOfBirth?.message}
                            control={control}
                        />

                        <NumericTextfield
                            workMode={mode}
                            displayName='Phone Number'
                            isTouched={Object.keys(touchedFields).length !== 0}
                            errors={errors.phoneNumber?.message}
                            register={register('phoneNumber')}
                        />

                        {mode === 'edit' && (
                            <div
                                style={{
                                    width: '75%',
                                    display: 'flex',
                                    flexDirection: 'row',
                                    justifyContent: 'space-evenly',
                                }}
                            >
                                <Button
                                    variant='contained'
                                    color='error'
                                    onClick={() => setIsCancelModalOpen(true)}
                                >
                                    Cancel
                                </Button>

                                <CustomDialog
                                    isOpen={isCancelModalOpen}
                                    name={closeDialogEventName}
                                    title='Discard changes?'
                                    content='Do you really want to cancel? Changes will not be saved.'
                                />

                                <Button
                                    type='submit'
                                    variant='contained'
                                    color='success'
                                    disabled={
                                        (errors.firstName?.message?.length ??
                                            0) > 0 ||
                                        (errors.lastName?.message?.length ??
                                            0) > 0 ||
                                        (errors.dateOfBirth?.message?.length ??
                                            0) > 0 ||
                                        (errors.phoneNumber?.message?.length ??
                                            0) > 0 ||
                                        (!touchedFields.firstName &&
                                            !touchedFields.lastName &&
                                            !touchedFields.middleName &&
                                            !touchedFields.dateOfBirth &&
                                            !touchedFields.phoneNumber)
                                    }
                                >
                                    Save changes
                                </Button>
                            </div>
                        )}
                    </Box>
                </>
            )}
        </>
    );
};

export default Profile;
