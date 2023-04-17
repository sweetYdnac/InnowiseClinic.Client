import { FunctionComponent } from 'react';
import Box from '@mui/material/Box';
import PasswordInput from '../PasswordInput';
import EmailAddressInput from '../EmailAddressInput';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { eventEmitter } from '../../events/events';
import { EventType } from '../../events/eventTypes';
import { LoginMessage } from '../Header';
import './styles/ModalForm.css';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import AuthorizationService from '../../services/AuthorizationService';
import ILoginRequest from '../../types/authorization/requests/ILoginRequest';
import { AxiosError } from 'axios';

const validationSchema = yup.object().shape({
    email: yup.string().required('Please, enter the email').email(`You've entered an invalid email`),
    password: yup
        .string()
        .min(6, 'Password must be at least 6 characters')
        .max(15, 'Password must be less than 15 characters')
        .required('Please, enter the password'),
});

const Login: FunctionComponent = () => {
    const {
        register,
        handleSubmit,
        setError,
        formState: { errors, touchedFields },
    } = useForm<ILoginRequest>({
        mode: 'onBlur',
        resolver: yupResolver(validationSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    });

    const onSubmit = async (data: ILoginRequest) => {
        try {
            await AuthorizationService.signIn(data);
            eventEmitter.emit(`${EventType.CLICK_CLOSE_MODAL} ${LoginMessage.LOGIN}`);
        } catch (error) {
            if (error instanceof AxiosError && error.response?.status === 400) {
                setError('email', {
                    message: error.response.data.errors?.Email?.[0] || error.response.data.Message || '',
                });

                setError('password', {
                    message: error.response.data.errors?.Password?.[0] || error.response.data.Message || '',
                });
            }
        }
    };

    const opedRegisterModel = () => {
        eventEmitter.emit(`${EventType.CLICK_CLOSE_MODAL} ${LoginMessage.REGISTER}`);
    };

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
            }}
        >
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
                <Typography variant='h4' gutterBottom>
                    Login
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

                <div
                    style={{
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-evenly',
                        marginTop: '20px',
                    }}
                >
                    <Button onClick={opedRegisterModel} variant='text' color='primary'>
                        Register
                    </Button>
                    <Button
                        type='submit'
                        variant='contained'
                        color='success'
                        disabled={
                            (errors.email?.message?.length ?? 0) > 0 ||
                            (errors.password?.message?.length ?? 0) > 0 ||
                            !touchedFields.email ||
                            !touchedFields.password
                        }
                    >
                        Enter
                    </Button>
                </div>
            </Box>
        </div>
    );
};

export default Login;
