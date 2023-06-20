import IGetPagedSpecializationsRequest from '../../types/services_api/requests/specialization/IGetPagedSpecializationsRequest';
import IPagedSpecializationsResponse from '../../types/services_api/responses/specialization/IPagedSpecializationsResponse';
import ISpecializationResponse from '../../types/services_api/responses/specialization/ISpecializationResponse';
import { getQueryString } from '../../utils/functions';
import https from '../../utils/https-common';

const getById = async (id: string) => {
    return (await https.get<ISpecializationResponse>(`/specializations/${id}`)).data;
};

const getPaged = async (data: IGetPagedSpecializationsRequest) => {
    let path = '/specializations?' + getQueryString(data);

    return (await https.get<IPagedSpecializationsResponse>(path)).data;
};

const SpecializationsService = {
    getById,
    getPaged,
};

export default SpecializationsService;
