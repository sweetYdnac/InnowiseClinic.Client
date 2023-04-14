import dayjs from 'dayjs';
import IDoctorInformationResponse from '../../doctors_api/responses/IDoctorInformationResponse';
import IOfficeInformationResponse from '../../offices_api/responses/IOfficeInformationResponse';
import IServiceInformationResponse from '../../services_api/responses/service/IServiceInformationResponse';
import ISpecializationResponse from '../../services_api/responses/specialization/ISpecializationResponse';
import IComboBoxItem from '../../common/IComboBoxItem';

export default interface ICreateAppointmentForm {
    office: IComboBoxItem<IOfficeInformationResponse> | null;
    doctor: IComboBoxItem<IDoctorInformationResponse> | null;
    specialization: IComboBoxItem<ISpecializationResponse> | null;
    service: IComboBoxItem<IServiceInformationResponse> | null;
    date: dayjs.Dayjs;
    time: dayjs.Dayjs;
}
