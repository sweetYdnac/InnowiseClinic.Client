import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import jwt from 'jwt-decode';
import AuthorizationService from '../services/AuthorizationService';

const AuthVerify = () => {
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        let accessToken = localStorage.getItem('accessToken');

        const refreshToken = async () => await AuthorizationService.refresh();

        if (accessToken !== null) {
            let decoded = jwt<any>(accessToken);

            if (decoded.exp * 1000 < Date.now()) {
                navigate('/');
                AuthorizationService.logout();
            }
        } else {
            navigate('/');
            refreshToken();
        }
    }, [location, navigate]);

    return <></>;
};

export default AuthVerify;
