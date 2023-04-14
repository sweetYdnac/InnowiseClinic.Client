import IGetPagedDoctorsRequest from '../types/doctors_api/requests/IGetPagedDoctorsRequest';
import IPagedDoctorsResponse from '../types/doctors_api/responses/IPagedDoctorsResponse';
import { getQueryString } from '../utils/functions';
import https from '../utils/https-common';

const getPaged = async (data: IGetPagedDoctorsRequest) => {
    let path = '/doctors?' + getQueryString(data);

    return (await https.get<IPagedDoctorsResponse>(path)).data;
};

const DoctorsService = {
    getPaged,
};

export default DoctorsService;
