import { useFormik } from 'formik';
import * as Yup from 'yup';
import AuthorizationService from '../../services/AuthorizationService';
import { AxiosError } from 'axios';
import { eventEmitter } from '../../events/events';
import { EventType } from '../../events/eventTypes';
import { LoginMessage } from '../../components/Header';
import IRegisterRequest from '../../types/authorization/requests/IRegisterRequest';

export default function GetRegisterRequestValidator() {
    const formik = useFormik<IRegisterRequest>({
        initialValues: {
            email: '',
            password: '',
            passwordConfirmation: '',
        },
        validationSchema: Yup.object().shape({
            email: Yup.string()
                .required('Please, enter the email')
                .email(`You've entered an invalid email`),

            password: Yup.string()
                .min(6, 'Password must be at least 6 characters')
                .max(15, 'Password must be less than 15 characters')
                .required('Please, enter the password'),

            passwordConfirmation: Yup.string().oneOf(
                [Yup.ref('password')],
                'Password confirmation does not match'
            ),
        }),
        validateOnBlur: true,
        validateOnChange: false,
        onSubmit: async (values) => {
            try {
                await AuthorizationService.signUp(values);
                eventEmitter.emit(
                    `${EventType.SWITCH_MODAL} ${LoginMessage.REGISTER}`,
                    {
                        loginState: false,
                    }
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
                        error.response.data.errors?.Password?.[0] || '';
                }
            }
        },
    });

    return formik;
}
