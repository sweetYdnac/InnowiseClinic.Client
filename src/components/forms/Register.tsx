import { FunctionComponent } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import EmailAddressInput from '../EmailAddressInput';
import PasswordInput from '../PasswordInput';
import './styles/ModalForm.css';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import IRegisterRequest from '../../types/authorization/requests/IRegisterRequest';
import AuthorizationService from '../../services/AuthorizationService';
import { eventEmitter } from '../../events/events';
import { EventType } from '../../events/eventTypes';
import { AxiosError } from 'axios';
import { LoginMessage } from '../Header';

const validationSchema = yup.object().shape({
    email: yup
        .string()
        .required('Please, enter the email')
        .email(`You've entered an invalid email`),

    password: yup
        .string()
        .min(6, 'Password must be at least 6 characters')
        .max(15, 'Password must be less than 15 characters')
        .required('Please, enter the password'),

    passwordConfirmation: yup
        .string()
        .oneOf([yup.ref('password')], 'Password confirmation does not match'),
});

const Register: FunctionComponent = () => {
    const {
        register,
        handleSubmit,
        formState: { errors, touchedFields },
        setError,
    } = useForm<IRegisterRequest>({
        mode: 'onBlur',
        resolver: yupResolver(validationSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    });

    const onSubmit = async (data: IRegisterRequest) => {
        try {
            await AuthorizationService.signUp(data);
            eventEmitter.emit(
                `${EventType.CLICK_CLOSE_MODAL} ${LoginMessage.REGISTER}`,
                {
                    loginState: false,
                }
            );
        } catch (error) {
            if (error instanceof AxiosError && error.response?.status === 400) {
                setError('email', {
                    message:
                        error.response.data.errors?.Email?.[0] ||
                        error.response.data.Message ||
                        '',
                });

                setError('password', {
                    message:
                        error.response.data.errors?.Password?.[0] ||
                        error.response.data.Message ||
                        '',
                });
            }
        }
    };

    return (
        <div className='form-wrapper'>
            <Box
                className='form-container'
                onSubmit={handleSubmit(onSubmit)}
                component='form'
                noValidate
                autoComplete='off'
            >
                <Typography variant='h4' gutterBottom>
                    Register
                </Typography>

                <EmailAddressInput
                    displayName='Email Address'
                    isTouched={touchedFields.email}
                    errors={errors.email?.message}
                    register={register('email')}
                />
                <PasswordInput
                    displayName='Password'
                    isTouched={touchedFields.password}
                    errors={errors.password?.message}
                    register={register('password')}
                />

                <PasswordInput
                    displayName='Password Confirmation'
                    isTouched={touchedFields.passwordConfirmation}
                    errors={errors.passwordConfirmation?.message}
                    register={register('passwordConfirmation')}
                />

                <Button
                    sx={{ marginTop: '20px' }}
                    type='submit'
                    variant='contained'
                    color='success'
                    disabled={
                        (errors.email?.message?.length ?? 0) > 0 ||
                        (errors.password?.message?.length ?? 0) > 0 ||
                        (errors.passwordConfirmation?.message?.length ?? 0) >
                            0 ||
                        !touchedFields.email ||
                        !touchedFields.password ||
                        !touchedFields.passwordConfirmation
                    }
                >
                    Enter
                </Button>
            </Box>
        </div>
    );
};

export default Register;
