import IPagedResponse from '../../common/responses/IPagedResponse';
import IDoctorInformationResponse from './IDoctorInformationResponse';

export default interface IPagedDoctorsResponse
    extends IPagedResponse<IDoctorInformationResponse> {}
