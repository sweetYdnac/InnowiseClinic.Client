import dayjs from 'dayjs';
import IDoctorInformationResponse from '../../doctors_api/responses/IDoctorInformationResponse';
import IOfficeInformationResponse from '../../offices_api/responses/IOfficeInformationResponse';
import IServiceInformationResponse from '../../services_api/responses/service/IServiceInformationResponse';
import ISpecializationResponse from '../../services_api/responses/specialization/ISpecializationResponse';
import IAutoCompleteItem from '../../common/IAutoCompleteItem';

export default interface ICreateAppointmentForm {
    office: IAutoCompleteItem<IOfficeInformationResponse> | null;
    doctor: IAutoCompleteItem<IDoctorInformationResponse> | null;
    specialization: IAutoCompleteItem<ISpecializationResponse> | null;
    service: IAutoCompleteItem<IServiceInformationResponse> | null;
    date: dayjs.Dayjs;
    time: dayjs.Dayjs;
}
