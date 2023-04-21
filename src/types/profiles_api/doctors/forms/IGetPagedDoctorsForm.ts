import IAutoCompleteItem from '../../../common/IAutoCompleteItem';
import IOfficeInformationResponse from '../../../offices_api/responses/IOfficeInformationResponse';
import ISpecializationResponse from '../../../services_api/responses/specialization/ISpecializationResponse';

export default interface IGetPagedDoctorsForm {
    office: IAutoCompleteItem<IOfficeInformationResponse> | null;
    specialization: IAutoCompleteItem<ISpecializationResponse> | null;
    doctor: string;
}
