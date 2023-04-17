import { AxiosResponse } from 'axios';
import jwt from 'jwt-decode';
import { NIL } from 'uuid';
import { LoginMessage } from '../components/Header';
import { EventType } from '../events/eventTypes';
import { eventEmitter } from '../events/events';
import ILoginRequest from '../types/authorization/requests/ILoginRequest';
import IRegisterRequest from '../types/authorization/requests/IRegisterRequest';
import ICreatedResponse from '../types/authorization/responses/ICreatedResponse';
import ITokenResponse from '../types/authorization/responses/ITokenResponse';
import ICreateProfileRequest from '../types/profile/requests/ICreateProfileRequest';
import https from '../utils/https-common';
import PatientsService from './PatientsService';

function setAuthData(accessToken: string, refreshToken: string) {
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('accessToken', accessToken);
    dispatchEvent(new Event('storage'));

    let decoded = jwt<any>(accessToken);
    localStorage.setItem('accountId', decoded.sub);
}

const getAccountId = () => {
    return localStorage.getItem('accountId') ?? NIL;
};

const getAccessToken = () => {
    return localStorage.getItem('accessToken');
};

const isAuthorized = () => {
    return !!localStorage.getItem('accessToken');
};

const signIn = async (data: ILoginRequest) => {
    return await https.post<ITokenResponse>('/authorization/signIn', data).then((response: any) => {
        setAuthData(response.data.accessToken, response.data.refreshToken);
    });
};

const signUp = async (data: IRegisterRequest) => {
    return await https.post<ICreatedResponse>('/authorization/signUp', data).then(async () => {
        await AuthorizationService.signIn(data as ILoginRequest).then(async () => {
            let request: ICreateProfileRequest = {
                id: getAccountId(),
                firstName: 'First Name',
                lastName: 'Last Name',
                middleName: '',
                dateOfBirth: '1900-01-01',
                phoneNumber: '111111111',
                photoId: NIL,
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

const refresh = async () => {
    let refreshToken = localStorage.getItem('refreshToken');

    await https.post<ITokenResponse>('/authorization/refresh', { refreshToken }).then((response: AxiosResponse<ITokenResponse, any>) => {
        setAuthData(response.data.accessToken ?? '', response.data.refreshToken ?? '');

        if (!response.data.accessToken || !response.data.refreshToken) {
            eventEmitter.emit(`${EventType.CLICK_CLOSE_MODAL} ${LoginMessage.LOGIN}`);
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
