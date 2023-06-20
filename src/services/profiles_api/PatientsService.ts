import dayjs from 'dayjs';
import ICreatedResponse from '../../types/authorization_api/responses/ICreatedResponse';
import ICreateProfileRequest from '../../types/profiles_api/patients/requests/ICreateProfileRequest';
import IUpdateProfileRequest from '../../types/profiles_api/patients/requests/IUpdateProfileRequest';
import IProfileResponse from '../../types/profiles_api/patients/response/IProfileResponse';
import https from '../../utils/https-common';

const getById = async (id: string) => {
    const response = (await https.get<IProfileResponse>(`/patients/${id}`)).data;

    return {
        ...response,
        dateOfBirth: dayjs(response.dateOfBirth),
    } as IProfileResponse;
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
