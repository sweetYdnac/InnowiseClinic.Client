import { useFormik } from 'formik';
import ILoginRequest from '../../types/authorization/requests/ILoginRequest';
import * as Yup from 'yup';
import AuthorizationService from '../../services/AuthorizationService';
import { AxiosError } from 'axios';
import { eventEmitter } from '../../events/events';
import { EventType } from '../../events/eventTypes';
import { LoginMessage } from '../../components/Header';

export default function GetLoginRequestValidator() {
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
                eventEmitter.emit(
                    `${EventType.SWITCH_MODAL} ${LoginMessage.LOGIN}`
                );
            } catch (error) {
                if (
                    error instanceof AxiosError &&
                    error.response?.status === 400
                ) {
                    formik.errors.email =
                        error.response.data.errors?.Email?.[0] ||
                        error.response.data.Message ||
                        '';
                    formik.errors.password =
                        error.response.data.errors?.Password?.[0] ||
                        error.response.data.Message ||
                        '';
                }
            }
        },
    });

    return formik;
}
