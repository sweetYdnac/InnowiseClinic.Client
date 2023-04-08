import { useFormik } from 'formik';
import * as Yup from 'yup';
import { AxiosError } from 'axios';
import PatientsService from '../../services/PatientsService';
import AuthorizationService from '../../services/AuthorizationService';
import IProfileResponse from '../../types/profile/response/IProfileResponse';

export default function GetProfileValidator(profile: IProfileResponse) {
    const formik = useFormik<IProfileResponse>({
        // initialValues: {
        //     firstName: '',
        //     lastName: '',
        //     middleName: '',
        //     dateOfBirth: '',
        //     phoneNumber: '',
        //     photoId: '',
        // },
        initialValues: profile,
        validationSchema: Yup.object().shape({
            firstName: Yup.string().required('Please, enter a first name'),
            lastName: Yup.string().required('Please, enter a first name'),
            middleName: Yup.string().notRequired(),
            dateOfBirth: Yup.string().required('Please, select the date'),
            phoneNumber: Yup.string()
                .matches(/^\d+$/, `You've entered an invalid phone number`)
                .required('Please, enter a phone number'),
            photoId: Yup.string()
                .notRequired()
                .uuid('Entered accound id not a uuid'),
        }),
        validateOnBlur: true,
        validateOnChange: false,
        onSubmit: async (values) => {
            try {
                await PatientsService.updatePatient(
                    AuthorizationService.getAccountId(),
                    values
                );
            } catch (error) {
                if (error instanceof AxiosError) {
                    switch (error.response?.status) {
                        case 400:
                            formik.errors.firstName =
                                error.response.data.errors?.FirstName?.[0] ||
                                error.response.data.Message ||
                                '';
                            formik.errors.lastName =
                                error.response.data.errors?.LastName?.[0] ||
                                error.response.data.Message ||
                                '';
                            formik.errors.dateOfBirth =
                                error.response.data.errors?.DateOfBirth?.[0] ||
                                error.response.data.Message ||
                                '';
                            formik.errors.phoneNumber =
                                error.response.data.errors?.PhoneNumber?.[0] ||
                                error.response.data.Message ||
                                '';
                            break;
                    }
                }
            }
        },
    });

    return formik;
}
