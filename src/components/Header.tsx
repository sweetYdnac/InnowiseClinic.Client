import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import MenuIcon from '@mui/icons-material/Menu';
import { FunctionComponent, useEffect, useState } from 'react';

import CustomizedModal from './customizedModal/CustomizedModal';
import Login from './forms/Login';
import AuthorizationService from '../services/AuthorizationService';
import { useNavigate } from 'react-router-dom';
import { eventEmitter } from '../events/events';
import { EventType } from '../events/eventTypes';
import Register from './forms/Register';

export enum LoginMessage {
    LOGIN = 'Login',
    REGISTER = 'Register',
    LOGOUT = 'Logout',
}

const Header: FunctionComponent = () => {
    const [accessToken, setAccessToken] = useState(
        AuthorizationService.getAccessToken()
    );
    const [loginMessage, setLoginMessage] = useState<LoginMessage>(
        accessToken ? LoginMessage.LOGOUT : LoginMessage.LOGIN
    );

    const navigate = useNavigate();
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

    useEffect(() => {
        const handleStorageChange = () => {
            setAccessToken(AuthorizationService.getAccessToken());
            setLoginMessage(
                AuthorizationService.getAccessToken()
                    ? LoginMessage.LOGOUT
                    : LoginMessage.LOGIN
            );
        };

        window.addEventListener('storage', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    useEffect(() => {
        const switchLoginModal = () => {
            setIsLoginModalOpen(!isLoginModalOpen);
        };
        const switchRegisterModal = (data: { loginState: boolean }) => {
            setIsLoginModalOpen(data?.loginState ?? !isLoginModalOpen);
            setIsRegisterModalOpen(!isRegisterModalOpen);
        };

        eventEmitter.addListener(
            `${EventType.SWITCH_MODAL} ${LoginMessage.LOGIN}`,
            switchLoginModal
        );
        eventEmitter.addListener(
            `${EventType.SWITCH_MODAL} ${LoginMessage.REGISTER}`,
            switchRegisterModal
        );

        return () => {
            eventEmitter.removeListener(
                `${EventType.SWITCH_MODAL} ${LoginMessage.LOGIN}`,
                switchLoginModal
            );
            eventEmitter.removeListener(
                `${EventType.SWITCH_MODAL} ${LoginMessage.REGISTER}`,
                switchRegisterModal
            );
        };
    }, [
        isLoginModalOpen,
        setIsLoginModalOpen,
        isRegisterModalOpen,
        setIsRegisterModalOpen,
        accessToken,
    ]);

    const handleLoginButton = () => {
        accessToken ? AuthorizationService.logout() : setIsLoginModalOpen(true);
    };

    return (
        <AppBar position='static'>
            <Toolbar>
                <IconButton
                    size='large'
                    edge='start'
                    color='inherit'
                    aria-label='menu'
                    sx={{ mr: 2 }}
                >
                    <MenuIcon />
                </IconButton>

                <Button onClick={() => navigate('/')} color='inherit'>
                    Innowise Clinic
                </Button>

                {accessToken && (
                    <Button
                        onClick={() => navigate('/profile')}
                        color='inherit'
                    >
                        Profile
                    </Button>
                )}

                <Button onClick={() => handleLoginButton()} color='inherit'>
                    {loginMessage}
                </Button>
                <CustomizedModal
                    isOpen={isLoginModalOpen}
                    name={LoginMessage.LOGIN}
                >
                    <Login />
                </CustomizedModal>
                <CustomizedModal
                    isOpen={isRegisterModalOpen}
                    name={LoginMessage.REGISTER}
                >
                    <Register />
                </CustomizedModal>
            </Toolbar>
        </AppBar>
    );
};

export default Header;
