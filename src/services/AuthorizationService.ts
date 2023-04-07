import https from '../utils/https-common';
import ITokenResponse from '../types/ITokenResponse';
import ILoginRequest from '../types/ILoginRequest';
import IRegisterRequest from '../types/IRegisterRequest';
import ICreatedResponse from '../types/ICreatedResponse';
import jwt from 'jwt-decode';
import { AxiosRequestConfig } from 'axios';
import PatientsService from './PatientsService';
import ICreatePatientRequest from '../types/profiles/patients/requests/ICreatePatientRequest';
import { NIL } from 'uuid';

const config: AxiosRequestConfig<any> | undefined = {
    headers: {
        'Content-Type': 'application/json',
    },
};

function setAuthData(accessToken: string, refreshToken: string) {
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('accessToken', accessToken);

    let decoded = jwt<any>(accessToken);
    localStorage.setItem('accountId', decoded.sub);
}

const getAccountId = () => {
    return localStorage.getItem('accountId') ?? NIL;
};

const getAccessToken = () => {
    return localStorage.getItem('accessToken') ?? NIL;
};

const isAuthorized = () => {
    return !!localStorage.getItem('accessToken');
};

const signIn = async (data: ILoginRequest) => {
    return await https
        .post<ITokenResponse>('/authorization/signIn', data, config)
        .then((response: any) => {
            setAuthData(response.data.accessToken, response.data.refreshToken);
        });
};

const signUp = async (data: IRegisterRequest) => {
    return await https
        .post<ICreatedResponse>('/authorization/signUp', data, config)
        .then(async () => {
            await AuthorizationService.signIn(data as ILoginRequest).then(
                async () => {
                    let request: ICreatePatientRequest = {
                        id: getAccountId(),
                        firstName: 'First Name',
                        lastName: 'Last Name',
                        middleName: '',
                        dateOfBirth: '1900-01-01',
                        phoneNumber: '111111111',
                        photoId: NIL,
                    };

                    await PatientsService.createPatient(request);
                }
            );
        });
};

const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('accountId');
};

const refresh = async () => {
    let refreshToken = localStorage.getItem('refreshToken');

    return await https
        .post<ITokenResponse>('/authorization/refresh', refreshToken, config)
        .then((response: any) => {
            setAuthData(response.data.accessToken, response.data.refreshToken);

            return response.data as ITokenResponse;
        });
};

const AuthorizationService = {
    isAuthorized,
    signIn,
    signUp,
    logout,
    refresh,
    getAccessToken,
};

export default AuthorizationService;
