import https from '../utils/https-common';
import ITokenResponse from '../types/ITokenResponse';
import ILoginRequest from '../types/ILoginRequest';
import IRegisterRequest from '../types/IRegisterRequest';
import ICreatedResponse from '../types/ICreatedResponse';

let ACCESS_TOKEN: string = '';

function setAuthData(accessToken: string, refreshToken: string) {
    localStorage.setItem('refreshToken', refreshToken);
    ACCESS_TOKEN = accessToken;
}

const isAuthorized = () => {
    return ACCESS_TOKEN.length > 0;
};

const signIn = async (data: ILoginRequest) => {
    return await https
        .post<ITokenResponse>('/authorization/signIn', data, {
            headers: {
                'Content-Type': 'application/json',
            },
        })
        .then((response: any) => {
            setAuthData(response.data.accessToken, response.data.refreshToken);
        });
};

const signUp = async (data: IRegisterRequest) => {
    return await https
        .post<ICreatedResponse>('/authorization/signUp', data, {
            headers: {
                'Content-Type': 'application/json',
            },
        })
        .then(async (response: any) => {
            localStorage.setItem('id', response.data.id);
            await AuthorizationService.signIn(data as ILoginRequest);
        });
};

const logout = async () => {
    ACCESS_TOKEN = '';
    localStorage.removeItem('refreshToken');
};

const AuthorizationService = {
    isAuthorized,
    signIn,
    signUp,
    logout,
};

export default AuthorizationService;
