import MenuIcon from '@mui/icons-material/Menu';
import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import { FunctionComponent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { EventType } from '../events/eventTypes';
import { eventEmitter } from '../events/events';
import AuthorizationService from '../services/AuthorizationService';
import CustomizedModal from './customizedModal/CustomizedModal';
import Login from './forms/Login';
import Register from './forms/Register';

export enum LoginMessage {
    LOGIN = 'Login',
    REGISTER = 'Register',
    LOGOUT = 'Logout',
}

const Header: FunctionComponent = () => {
    const [isAuthorizated, setIsAuthorized] = useState(AuthorizationService.isAuthorized());
    const navigate = useNavigate();
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
    const [loginMessage, setLoginMessage] = useState<LoginMessage>(isAuthorizated ? LoginMessage.LOGOUT : LoginMessage.LOGIN);

    useEffect(() => {
        const handleStorageChange = () => {
            setIsAuthorized(AuthorizationService.isAuthorized());
            setLoginMessage(AuthorizationService.isAuthorized() ? LoginMessage.LOGOUT : LoginMessage.LOGIN);
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

        eventEmitter.addListener(`${EventType.CLICK_CLOSE_MODAL} ${LoginMessage.LOGIN}`, switchLoginModal);
        eventEmitter.addListener(`${EventType.CLICK_CLOSE_MODAL} ${LoginMessage.REGISTER}`, switchRegisterModal);

        return () => {
            eventEmitter.removeListener(`${EventType.CLICK_CLOSE_MODAL} ${LoginMessage.LOGIN}`, switchLoginModal);
            eventEmitter.removeListener(`${EventType.CLICK_CLOSE_MODAL} ${LoginMessage.REGISTER}`, switchRegisterModal);
        };
    }, [isLoginModalOpen, setIsLoginModalOpen, isRegisterModalOpen, setIsRegisterModalOpen, isAuthorizated]);

    const handleLogin = () => {
        isAuthorizated ? AuthorizationService.logout() : setIsLoginModalOpen(true);
    };

    const handleAsideToggle = () => {
        eventEmitter.emit(EventType.SWITCH_ASIDE);
    };

    return (
        <>
            <AppBar
                sx={{
                    '&.MuiAppBar-root': {
                        position: 'inherit',
                    },
                }}
            >
                <Toolbar>
                    <IconButton color='inherit' edge='start' onClick={handleAsideToggle} sx={{ mr: 2, display: { sm: 'none' } }}>
                        <MenuIcon />
                    </IconButton>

                    <Button onClick={() => navigate('/')} color='inherit'>
                        Innowise Clinic
                    </Button>

                    <Button onClick={() => handleLogin()} color='inherit' sx={{ marginLeft: 'auto' }}>
                        {loginMessage}
                    </Button>
                </Toolbar>
            </AppBar>

            {isLoginModalOpen && (
                <CustomizedModal isOpen={isLoginModalOpen} name={LoginMessage.LOGIN}>
                    <Login />
                </CustomizedModal>
            )}

            {isRegisterModalOpen && (
                <CustomizedModal isOpen={isRegisterModalOpen} name={LoginMessage.REGISTER}>
                    <Register />
                </CustomizedModal>
            )}
        </>
    );
};

export default Header;
