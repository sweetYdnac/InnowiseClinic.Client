import IPagedResponse from '../../../common/responses/IPagedResponse';
import IServiceInformationResponse from './IServiceInformationResponse';

export default interface IPagedServicesResponse extends IPagedResponse<IServiceInformationResponse> {}
