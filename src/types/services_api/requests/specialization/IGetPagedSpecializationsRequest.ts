import IPagedRequest from '../../../common/requests/IPagedRequest';

export default interface IGetPagedSpecializationsRequest extends IPagedRequest {
    isActive: boolean;
    title?: string;
}
