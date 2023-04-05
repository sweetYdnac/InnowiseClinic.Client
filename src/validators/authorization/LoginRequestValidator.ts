import { useFormik } from 'formik';
import ILoginRequest from '../../types/ILoginRequest';
import * as Yup from 'yup';
import AuthorizationService from '../../services/AuthorizationService';
import { AxiosError } from 'axios';
import { useState } from 'react';

export default function GetLoginRequestValidator(
    setLoginOpen: React.Dispatch<React.SetStateAction<boolean>>
) {
    const [errorMessage, setErrorMessage] = useState('');

    const formik = useFormik<ILoginRequest>({
        initialValues: {
            email: '',
            password: '',
        },
        validationSchema: Yup.object().shape({
            email: Yup.string()
                .required('Please, enter the email')
                .email(`You've entered an invalid email`),

            password: Yup.string()
                .min(6, 'Password must be at least 6 characters')
                .max(15, 'Password must be less than 15 characters')
                .required('Please, enter the password'),
        }),
        validateOnBlur: true,
        validateOnChange: false,
        onSubmit: async (values) => {
            try {
                await AuthorizationService.signIn(values);
                setLoginOpen(false);
            } catch (error) {
                if (error instanceof AxiosError) {
                    switch (error.response?.status) {
                        case 400:
                            formik.errors.email =
                                error.response.data.errors?.Email?.[0] ||
                                error.response.data.Message ||
                                '';
                            formik.errors.password =
                                error.response.data.errors?.Password?.[0] ||
                                error.response.data.Message ||
                                '';
                            break;
                        case 409:
                            setErrorMessage(error.response.data.Message);
                            break;
                        case 500:
                            setErrorMessage(error.response.statusText);
                            break;
                        default:
                            setErrorMessage('Unexpected error occurred');
                    }
                }
            }
        },
    });

    return {
        formik,
        errorMessage,
        setErrorMessage,
    };
}
