import IGetPagedDoctorsRequest from '../../types/profiles_api/doctors/requests/IGetPagedDoctorsRequest';
import IPagedDoctorsResponse from '../../types/profiles_api/doctors/responses/IPagedDoctorsResponse';
import { getQueryString } from '../../utils/functions';
import https from '../../utils/https-common';

const getPaged = async (data: IGetPagedDoctorsRequest) => {
    let path = '/doctors?' + getQueryString(data);

    return (await https.get<IPagedDoctorsResponse>(path)).data;
};

const DoctorsService = {
    getPaged,
};

export default DoctorsService;
