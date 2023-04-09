import https from '../utils/https-common';
import ILoginRequest from '../types/authorization/requests/ILoginRequest';
import ICreatedResponse from '../types/authorization/responses/ICreatedResponse';
import jwt from 'jwt-decode';
import PatientsService from './PatientsService';
import ICreateProfileRequest from '../types/profile/requests/ICreateProfileRequest';
import { NIL } from 'uuid';
import ITokenResponse from '../types/authorization/responses/ITokenResponse';
import IRegisterRequest from '../types/authorization/requests/IRegisterRequest';
import { eventEmitter } from '../events/events';
import { EventType } from '../events/eventTypes';
import { LoginMessage } from '../components/Header';

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
        .post<ITokenResponse>('/authorization/signIn', data)
        .then((response: any) => {
            setAuthData(response.data.accessToken, response.data.refreshToken);
        });
};

const signUp = async (data: IRegisterRequest) => {
    return await https
        .post<ICreatedResponse>('/authorization/signUp', data)
        .then(async () => {
            await AuthorizationService.signIn(data as ILoginRequest).then(
                async () => {
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

    if (!refreshToken) {
        // eventEmitter.emit(`${EventType.SWITCH_MODAL} ${LoginMessage.LOGIN}`);
    } else {
        await https
            .post<ITokenResponse>('/authorization/refresh', { refreshToken })
            .then((response: any) => {
                if (!response.data) {
                    eventEmitter.emit(
                        `${EventType.SWITCH_MODAL} ${LoginMessage.LOGIN}`
                    );
                } else {
                    setAuthData(
                        response.data.accessToken,
                        response.data.refreshToken
                    );
                }
            });
    }
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
