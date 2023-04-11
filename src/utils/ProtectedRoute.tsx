import { ReactNode, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoginMessage } from '../components/Header';
import { EventType } from '../events/eventTypes';
import { eventEmitter } from '../events/events';
import AuthorizationService from '../services/AuthorizationService';
import jwt from 'jwt-decode';
import Loader from '../components/Loader';

interface ProtectedRouteProps {
    children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
    const [display, setDisplay] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const refresh = async () => {
            let refreshToken = localStorage.getItem('refreshToken');

            if (!refreshToken) {
                navigate('/');
                eventEmitter.emit(
                    `${EventType.SWITCH_MODAL} ${LoginMessage.LOGIN}`
                );
            } else {
                await AuthorizationService.refresh().then(() => {
                    if (AuthorizationService.getAccessToken()) {
                        setDisplay(true);
                    }
                });
            }
        };

        let accessToken = localStorage.getItem('accessToken');

        if (accessToken) {
            let decoded = jwt<any>(accessToken);

            if (decoded.exp * 1000 < Date.now()) {
                refresh();
            } else {
                setDisplay(true);
            }
        } else {
            refresh();
        }
    }, [navigate]);

    return <>{display ? children : <Loader isOpen={!display} />}</>;
};

export default ProtectedRoute;
