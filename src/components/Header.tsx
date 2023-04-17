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
import ProtectedRoute from '../utils/ProtectedRoute';
import CustomizedModal from './customizedModal/CustomizedModal';
import CreateAppointment from './forms/CreateAppointment';
import Login from './forms/Login';
import Register from './forms/Register';

export enum LoginMessage {
    LOGIN = 'Login',
    REGISTER = 'Register',
    LOGOUT = 'Logout',
}
const createAppointmentModalEventMessage = 'createAppointment';

const Header: FunctionComponent = () => {
    const [accessToken, setAccessToken] = useState(AuthorizationService.getAccessToken());
    const navigate = useNavigate();
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
    const [loginMessage, setLoginMessage] = useState<LoginMessage>(accessToken ? LoginMessage.LOGOUT : LoginMessage.LOGIN);
    const [isCreateAppointmentModalOpen, setIsCreateAppointmentModalOpen] = useState(false);

    useEffect(() => {
        const handleStorageChange = () => {
            setAccessToken(AuthorizationService.getAccessToken());
            setLoginMessage(AuthorizationService.getAccessToken() ? LoginMessage.LOGOUT : LoginMessage.LOGIN);
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

        const closeCreateAppointmentModal = () => {
            setIsCreateAppointmentModalOpen(false);
        };

        eventEmitter.addListener(`${EventType.CLICK_CLOSE_MODAL} ${LoginMessage.LOGIN}`, switchLoginModal);
        eventEmitter.addListener(`${EventType.CLICK_CLOSE_MODAL} ${LoginMessage.REGISTER}`, switchRegisterModal);
        eventEmitter.addListener(`${EventType.SUBMIT_DIALOG} ${createAppointmentModalEventMessage}`, closeCreateAppointmentModal);

        return () => {
            eventEmitter.removeListener(`${EventType.CLICK_CLOSE_MODAL} ${LoginMessage.LOGIN}`, switchLoginModal);
            eventEmitter.removeListener(`${EventType.CLICK_CLOSE_MODAL} ${LoginMessage.REGISTER}`, switchRegisterModal);
            eventEmitter.removeListener(`${EventType.SUBMIT_DIALOG} ${createAppointmentModalEventMessage}`, closeCreateAppointmentModal);
        };
    }, [isLoginModalOpen, setIsLoginModalOpen, isRegisterModalOpen, setIsRegisterModalOpen, accessToken, isCreateAppointmentModalOpen]);

    const handleLogin = () => {
        accessToken ? AuthorizationService.logout() : setIsLoginModalOpen(true);
    };

    const handleCreateAppointment = () => {
        setIsCreateAppointmentModalOpen(true);
    };

    return (
        <>
            <AppBar position='static'>
                <Toolbar>
                    <IconButton size='large' edge='start' color='inherit' aria-label='menu' sx={{ mr: 2 }}>
                        <MenuIcon />
                    </IconButton>

                    <Button onClick={() => navigate('/')} color='inherit'>
                        Innowise Clinic
                    </Button>

                    {accessToken && (
                        <Button onClick={() => navigate('/profile')} color='inherit'>
                            Profile
                        </Button>
                    )}

                    {accessToken && (
                        <Button onClick={handleCreateAppointment} color='inherit'>
                            Create Appointment
                        </Button>
                    )}

                    <Button onClick={() => handleLogin()} color='inherit'>
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

            {isCreateAppointmentModalOpen && (
                <CustomizedModal isOpen={isCreateAppointmentModalOpen} name={createAppointmentModalEventMessage}>
                    <ProtectedRoute>
                        <CreateAppointment modalName={createAppointmentModalEventMessage} />
                    </ProtectedRoute>
                </CustomizedModal>
            )}
        </>
    );
};

export default Header;
