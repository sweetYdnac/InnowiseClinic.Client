import IGetPagedServicesRequest from '../../types/services_api/requests/service/IGetPagedServicesRequest';
import IPagedServicesResponse from '../../types/services_api/responses/service/IPagedServicesResponse';
import { getQueryString } from '../../utils/functions';
import https from '../../utils/https-common';

const getPaged = async (data: IGetPagedServicesRequest) => {
    let path = '/services?' + getQueryString(data);

    return (await https.get<IPagedServicesResponse>(path)).data;
};

const ServicesService = {
    getPaged,
};

export default ServicesService;
