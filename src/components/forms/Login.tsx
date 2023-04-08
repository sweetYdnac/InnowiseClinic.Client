import { FunctionComponent } from 'react';
import Box from '@mui/material/Box';
import PasswordInput from '../PasswordInput';
import EmailAddressInput from '../EmailAddressInput';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import GetLoginRequestValidator from '../../validators/authorization/LoginRequestValidator';
import { eventEmitter } from '../../events/events';
import { EventType } from '../../events/eventTypes';
import { LoginMessage } from '../Header';
import './styles/ModalForm.css';

const Login: FunctionComponent = () => {
    const validator = GetLoginRequestValidator();

    const opedRegisterModel = () => {
        eventEmitter.emit(`${EventType.SWITCH_MODAL} ${LoginMessage.REGISTER}`);
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
                onSubmit={validator.handleSubmit}
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
                    isTouched={validator.touched.email}
                    errors={validator.errors.email}
                    handleChange={validator.handleChange}
                    handleBlur={validator.handleBlur}
                />
                <PasswordInput
                    displayName='Password'
                    isTouched={validator.touched.password}
                    errors={validator.errors.password}
                    handleChange={validator.handleChange}
                    handleBlur={validator.handleBlur}
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
                    <Button
                        onClick={opedRegisterModel}
                        variant='text'
                        color='primary'
                    >
                        Register
                    </Button>
                    <Button
                        type='submit'
                        variant='contained'
                        color='success'
                        disabled={
                            (validator.errors.email?.length ?? 0) > 0 ||
                            (validator.errors.password?.length ?? 0) > 0 ||
                            !validator.touched.email ||
                            !validator.touched.password
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
