import { ReactNode, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoginMessage } from '../components/Header';
import Loader from '../components/Loader';
import { EventType } from '../events/eventTypes';
import { eventEmitter } from '../events/events';
import AuthorizationService from '../services/authorization_api/AuthorizationService';

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
                eventEmitter.emit(`${EventType.CLICK_CLOSE_MODAL} ${LoginMessage.LOGIN}`);
            } else {
                await AuthorizationService.refresh().then(() => {
                    if (AuthorizationService.isAuthorized()) {
                        setDisplay(true);
                    }
                });
            }
        };

        if (!AuthorizationService.isAuthorized()) {
            refresh();
        } else {
            setDisplay(true);
        }
    }, []);

    return <>{display ? children : <Loader isOpen={!display} />}</>;
};

export default ProtectedRoute;
