import IGetPagedOfficesRequest from '../types/offices_api/requests/IGetPagedOfficesRequest';
import IPagedOfficeResponse from '../types/offices_api/responses/IPagedOfficeResponse';
import { getQueryString } from '../utils/functions';
import https from '../utils/https-common';

const getPaged = async (data: IGetPagedOfficesRequest) => {
    let path = '/offices?' + getQueryString(data);

    return (await https.get<IPagedOfficeResponse>(path)).data;
};

const OfficesService = {
    getPaged,
};

export default OfficesService;
