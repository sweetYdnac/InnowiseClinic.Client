import https from '../utils/https-common';
import ICreatePatientRequest from '../types/profiles/patients/requests/ICreatePatientRequest';
import ICreatedResponse from '../types/ICreatedResponse';
import { AxiosRequestConfig } from 'axios';
import AuthorizationService from './AuthorizationService';

const config: AxiosRequestConfig<any> | undefined = {
    headers: {
        'Content-Type': 'application/json',
    },
};

const createPatient = async (data: ICreatePatientRequest) => {
    return await https.post<ICreatedResponse>('/patients', data, {
        headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + AuthorizationService.getAccessToken(),
        },
    });
};

const PatientsService = {
    createPatient,
};

export default PatientsService;
