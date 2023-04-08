import { FunctionComponent } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import GetRegisterRequestValidator from '../../validators/authorization/RegisterRequestValidator';
import EmailAddressInput from '../EmailAddressInput';
import PasswordInput from '../PasswordInput';
import './styles/ModalForm.css';

interface RegisterProps {}

const Register: FunctionComponent<RegisterProps> = () => {
    const validator = GetRegisterRequestValidator();

    return (
        <div className='form-wrapper'>
            <Box
                className='form-container'
                onSubmit={validator.handleSubmit}
                component='form'
                noValidate
                autoComplete='off'
            >
                <Typography variant='h4' gutterBottom>
                    Register
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

                <PasswordInput
                    id='passwordConfirmation'
                    displayName='Password Confirmation'
                    isTouched={validator.touched.passwordConfirmation}
                    errors={validator.errors.passwordConfirmation}
                    handleChange={validator.handleChange}
                    handleBlur={validator.handleBlur}
                />

                <Button
                    type='submit'
                    variant='contained'
                    color='success'
                    disabled={
                        (validator.errors.email?.length ?? 0) > 0 ||
                        (validator.errors.password?.length ?? 0) > 0 ||
                        (validator.errors.passwordConfirmation?.length ?? 0) >
                            0 ||
                        !validator.touched.email ||
                        !validator.touched.password ||
                        !validator.touched.passwordConfirmation
                    }
                    sx={{ marginTop: '20px' }}
                >
                    Enter
                </Button>
            </Box>
        </div>
    );
};

export default Register;
