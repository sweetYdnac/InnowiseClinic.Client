import IGetCategoriesResponse from '../../types/services_api/responses/categories/IGetCategoriesResponse';
import https from '../../utils/https-common';

const getAll = async () => {
    return (await https.get<IGetCategoriesResponse>('/services/categories')).data;
};

const ServiceCategoriesService = {
    getAll,
};

export default ServiceCategoriesService;
