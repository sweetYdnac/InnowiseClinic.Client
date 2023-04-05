import { FunctionComponent } from 'react';
import Box from '@mui/material/Box';
import PasswordInput from '../components/PasswordInput';
import EmailAddressInput from '../components/EmailAddressInput';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import GetLoginRequestValidator from '../validators/authorization/LoginRequestValidator';
import React from 'react';
import Popup from '../components/Popup';

interface LoginProps {
    setLoginModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    setRegisterModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const Login: FunctionComponent<LoginProps> = ({
    setLoginModalOpen,
    setRegisterModalOpen,
}) => {
    const validator = GetLoginRequestValidator(setLoginModalOpen);

    const handleOpenRegisterModal = () => {
        setRegisterModalOpen(true);
        setLoginModalOpen(false);
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
                onSubmit={validator.formik.handleSubmit}
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
                    isTouched={validator.formik.touched.email}
                    errors={validator.formik.errors.email}
                    handleChange={validator.formik.handleChange}
                    handleBlur={validator.formik.handleBlur}
                />
                <PasswordInput
                    displayName='Password'
                    isTouched={validator.formik.touched.password}
                    errors={validator.formik.errors.password}
                    handleChange={validator.formik.handleChange}
                    handleBlur={validator.formik.handleBlur}
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
                        onClick={handleOpenRegisterModal}
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
                            (validator.formik.errors.email?.length ?? 0) > 0 ||
                            (validator.formik.errors.password?.length ?? 0) >
                                0 ||
                            !validator.formik.touched.email ||
                            !validator.formik.touched.password
                        }
                    >
                        Enter
                    </Button>
                </div>
            </Box>

            <Popup
                style={{ position: 'inherit', marginTop: '20px' }}
                color='error'
                message={validator.errorMessage}
                open={validator.errorMessage.length > 0}
                onHandleClose={() => validator.setErrorMessage('')}
            />
        </div>
    );
};

export default Login;
