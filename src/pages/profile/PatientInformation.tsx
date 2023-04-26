import { yupResolver } from '@hookform/resolvers/yup';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { AxiosError } from 'axios';
import dayjs from 'dayjs';
import { FunctionComponent, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import Datepicker from '../../components/CustomDatePicker';
import CustomDialog from '../../components/CustomDialog';
import CustomFormTextfield from '../../components/CustomTextField';
import PhotoDownload from '../../components/PhotoDownload';
import SubmitButton from '../../components/SubmitButton';
import { EventType } from '../../events/eventTypes';
import { eventEmitter } from '../../events/events';
import AuthorizationService from '../../services/authorization_api/AuthorizationService';
import PhotosService from '../../services/documents_api/PhotosService';
import PatientsService from '../../services/profiles_api/PatientsService';
import { WorkMode } from '../../types/common/WorkMode';
import IUpdateProfileForm from '../../types/profiles_api/patients/IUpdatePatientProfileForm';

const closeDialogEventName = 'updateProfile';

interface PatientInformationProps {
    workMode?: WorkMode;
    profile: IUpdateProfileForm | null;
    setProfile: React.Dispatch<React.SetStateAction<IUpdateProfileForm | null>>;
}

const validationSchema = yup.object().shape({
    firstName: yup.string().required('Please, enter a first name'),
    lastName: yup.string().required('Please, enter a first name'),
    middleName: yup.string().notRequired(),
    dateOfBirth: yup.date().required('Please, select the date').typeError('Please, enter a valid date'),
    phoneNumber: yup.string().required('Please, enter a phone number').matches(/^\d+$/, `You've entered an invalid phone number`),
    photoId: yup.string().notRequired().uuid('Entered accound id not a uuid'),
    photo: yup.string().notRequired(),
});

const PatientInformation: FunctionComponent<PatientInformationProps> = ({ workMode = 'view', profile, setProfile }) => {
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
        defaultValues: profile ?? {},
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
            const { photoId, photo, dateOfBirth, ...rest } = data;

            const request = {
                ...rest,
                dateOfBirth: dayjs(dateOfBirth).format('YYYY-MM-DD'),
            };

            await PatientsService.updatePatient(AuthorizationService.getAccountId(), request);

            if (getValues('photo') !== defaultValues?.photo) {
                await PhotosService.update(photoId, photo);
            }

            setWorkMode('view');
            setProfile(getValues());
        } catch (error) {
            if (error instanceof AxiosError && error.response?.status === 400) {
                console.log(error.response.data.errors);
                setError('firstName', {
                    message: error.response.data.errors?.FirstName?.[0] ?? error.response.data.Message ?? '',
                });
                setError('lastName', {
                    message: error.response.data.errors?.LastName?.[0] ?? error.response.data.Message ?? '',
                });
                setError('dateOfBirth', {
                    message: error.response.data.errors?.dateOfBirth?.[0] ?? error.response.data.Message ?? '',
                });
                setError('phoneNumber', {
                    message: error.response.data.errors?.PhoneNumber?.[0] ?? error.response.data.Message ?? '',
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

        eventEmitter.addListener(`${EventType.DECLINE_DIALOG} ${closeDialogEventName}`, handleDeclineDialog);
        eventEmitter.addListener(`${EventType.SUBMIT_DIALOG} ${closeDialogEventName}`, handleSubmitDialog);

        return () => {
            eventEmitter.removeListener(`${EventType.DECLINE_DIALOG} ${closeDialogEventName}`, handleDeclineDialog);
            eventEmitter.removeListener(`${EventType.SUBMIT_DIALOG} ${closeDialogEventName}`, handleSubmitDialog);
        };
    }, [reset]);

    return (
        <>
            {mode === 'view' && <Button onClick={enableEditMode}>Edit</Button>}
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
                <PhotoDownload workMode={mode} photo={getValues('photo')} register={register('photo')} />

                <CustomFormTextfield
                    id={register('firstName').name}
                    control={control}
                    workMode={mode}
                    displayName='First Name'
                    inputMode='text'
                />

                <CustomFormTextfield
                    id={register('lastName').name}
                    control={control}
                    workMode={mode}
                    displayName='Last Name'
                    inputMode='text'
                />

                <CustomFormTextfield
                    id={register('middleName').name}
                    control={control}
                    workMode={mode}
                    displayName='Middle Name'
                    inputMode='text'
                />

                <Datepicker readOnly={mode === 'view'} id={register('dateOfBirth').name} displayName='Date of Birth' control={control} />

                <CustomFormTextfield
                    id={register('phoneNumber').name}
                    control={control}
                    workMode={mode}
                    displayName='Phone Number'
                    inputMode='numeric'
                    startAdornment={<>+</>}
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
                        <Button variant='contained' color='error' onClick={() => setIsCancelModalOpen(true)}>
                            Cancel
                        </Button>

                        <CustomDialog
                            isOpen={isCancelModalOpen}
                            name={closeDialogEventName}
                            title='Discard changes?'
                            content='Do you really want to cancel? Changes will not be saved.'
                        />

                        <SubmitButton errors={errors} touchedFields={touchedFields}>
                            SaveChanges
                        </SubmitButton>
                    </div>
                )}
            </Box>
        </>
    );
};

export default PatientInformation;
