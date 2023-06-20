import { AxiosRequestConfig, AxiosResponse } from 'axios';
import jwt from 'jwt-decode';
import { NIL } from 'uuid';
import { LoginMessage } from '../../components/Header';
import { EventType } from '../../events/eventTypes';
import { eventEmitter } from '../../events/events';
import ILoginRequest from '../../types/authorization_api/requests/ILoginRequest';
import IRegisterRequest from '../../types/authorization_api/requests/IRegisterRequest';
import ICreatedResponse from '../../types/authorization_api/responses/ICreatedResponse';
import ITokenResponse from '../../types/authorization_api/responses/ITokenResponse';
import ICreateProfileRequest from '../../types/profiles_api/patients/requests/ICreateProfileRequest';
import https from '../../utils/https-common';
import PatientsService from '../profiles_api/PatientsService';

function setAuthData(accessToken: string, refreshToken: string) {
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('accessToken', accessToken);
    dispatchEvent(new Event('storage'));

    const decoded = jwt<any>(accessToken);
    localStorage.setItem('accountId', decoded.sub);
}

const getAccountId = () => {
    return localStorage.getItem('accountId') ?? NIL;
};

const getAccessToken = () => {
    return localStorage.getItem('accessToken');
};

const isAuthorized = () => {
    const accessToken = localStorage.getItem('accessToken');

    if (accessToken) {
        const decoded = jwt<any>(accessToken);

        return decoded.exp * 1000 > Date.now();
    }

    return false;
};

const signIn = async (data: ILoginRequest) => {
    return await https.post<ITokenResponse>('/authorization/signIn', data).then(async (response: any) => {
        setAuthData(response.data.accessToken, response.data.refreshToken);
    });
};

const signUp = async (data: IRegisterRequest) => {
    return await https.post<ICreatedResponse>('/authorization/signUp', data).then(async () => {
        await AuthorizationService.signIn(data as ILoginRequest).then(async () => {
            const request: ICreateProfileRequest = {
                id: getAccountId(),
                firstName: 'First Name',
                lastName: 'Last Name',
                middleName: '',
                dateOfBirth: '1900-01-01',
                phoneNumber: '111111111',
                photoId: null,
            };

            await PatientsService.createPatient(request);
        });
    });
};

const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('accountId');
    dispatchEvent(new Event('storage'));
};

const refresh = async (config?: AxiosRequestConfig<any>) => {
    const refreshToken = localStorage.getItem('refreshToken');

    return await https
        .post<ITokenResponse>('/authorization/refresh', { refreshToken })
        .then(async (response: AxiosResponse<ITokenResponse, any>) => {
            setAuthData(response.data.accessToken ?? '', response.data.refreshToken ?? '');

            if (!response.data.accessToken || !response.data.refreshToken) {
                logout();
                eventEmitter.emit(`${EventType.CLICK_CLOSE_MODAL} ${LoginMessage.LOGIN}`);
            } else {
                if (config) {
                    return await https(config);
                }
            }
        });
};

const AuthorizationService = {
    isAuthorized,
    signIn,
    signUp,
    logout,
    refresh,
    getAccessToken,
    getAccountId,
};

export default AuthorizationService;
