import { FunctionComponent } from 'react';
import Box from '@mui/material/Box';
import PasswordInput from '../components/PasswordInput';
import EmailAddressInput from '../components/EmailAddressInput';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import React from 'react';
import GetRegisterRequestValidator from '../validators/authorization/RegisterRequestValidator';
import Popup from '../components/Popup';

interface RegisterProps {
    setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const Register: FunctionComponent<RegisterProps> = ({ setModalOpen }) => {
    const validator = GetRegisterRequestValidator(setModalOpen);

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
                    Register
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

                <PasswordInput
                    id='passwordConfirmation'
                    displayName='Password Confirmation'
                    isTouched={validator.formik.touched.passwordConfirmation}
                    errors={validator.formik.errors.passwordConfirmation}
                    handleChange={validator.formik.handleChange}
                    handleBlur={validator.formik.handleBlur}
                />

                <Button
                    type='submit'
                    variant='contained'
                    color='success'
                    disabled={
                        (validator.formik.errors.email?.length ?? 0) > 0 ||
                        (validator.formik.errors.password?.length ?? 0) > 0 ||
                        (validator.formik.errors.passwordConfirmation?.length ??
                            0) > 0 ||
                        !validator.formik.touched.email ||
                        !validator.formik.touched.password ||
                        !validator.formik.touched.passwordConfirmation
                    }
                    sx={{ marginTop: '20px' }}
                >
                    Enter
                </Button>
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

export default Register;
