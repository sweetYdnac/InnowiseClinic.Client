import IPagedRequest from '../../../common/requests/IPagedRequest';

export default interface IGetPagedServicesRequest extends IPagedRequest {
    isActive: boolean;
    title?: string;
    specializationId?: string;
}
