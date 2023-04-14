import IPagedRequest from '../../common/requests/IPagedRequest';

export default interface IGetPagedDoctorsRequest extends IPagedRequest {
    onlyAtWork: boolean;
    officeId?: string;
    specializationId?: string;
    fullName?: string;
}
