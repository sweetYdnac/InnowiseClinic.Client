import dayjs from 'dayjs';
import IAutoCompleteItem from '../../common/IAutoCompleteItem';

import IOfficeInformationResponse from '../../offices_api/responses/IOfficeInformationResponse';
import IDoctorInformationResponse from '../../profiles_api/doctors/responses/IDoctorInformationResponse';
import IServiceInformationResponse from '../../services_api/responses/service/IServiceInformationResponse';
import ISpecializationResponse from '../../services_api/responses/specialization/ISpecializationResponse';
import ITimeSlot from '../ITimeSlot';

export default interface ICreateAppointmentForm {
    office: IAutoCompleteItem<IOfficeInformationResponse> | null;
    doctor: IAutoCompleteItem<IDoctorInformationResponse> | null;
    specialization: IAutoCompleteItem<ISpecializationResponse> | null;
    service: IAutoCompleteItem<IServiceInformationResponse> | null;
    date: dayjs.Dayjs;
    time: ITimeSlot | null;
}
