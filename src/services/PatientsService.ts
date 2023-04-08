import https from '../utils/https-common';
import ICreateProfileRequest from '../types/profile/requests/ICreateProfileRequest';
import ICreatedResponse from '../types/authorization/responses/ICreatedResponse';
import IProfileResponse from '../types/profile/response/IProfileResponse';
import IUpdateProfileRequest from '../types/profile/requests/IUpdateProfileRequest';

const getById = async (id: string) => {
    return await https.get<IProfileResponse>(`/patients/${id}`);
};

const createPatient = async (data: ICreateProfileRequest) => {
    return await https.post<ICreatedResponse>('/patients', data);
};

const updatePatient = async (id: string, data: IUpdateProfileRequest) => {
    return await https.put(`/patients/${id}`, data);
};

const PatientsService = {
    createPatient,
    getById,
    updatePatient,
};

export default PatientsService;
