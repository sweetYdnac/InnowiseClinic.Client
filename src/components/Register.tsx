import { FunctionComponent } from 'react';
import Box from '@mui/material/Box';
import PasswordInput from './PasswordInput';
import EmailAddressInput from './EmailAddressInput';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import GetRegisterRequestValidator from '../validators/authorization/RegisterRequestValidator';
import Popup from './Popup';
import '../styles/ModalForm.css';

interface RegisterProps {}

const Register: FunctionComponent<RegisterProps> = () => {
    const validator = GetRegisterRequestValidator();

    return (
        <div className='form-wrapper'>
            <Box
                className='form-container'
                onSubmit={validator.formik.handleSubmit}
                component='form'
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
