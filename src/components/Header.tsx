import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import MenuIcon from '@mui/icons-material/Menu';
import { FunctionComponent, useEffect, useState } from 'react';

import CustomizedModal from './customizedModal/CustomizedModal';
import Login from '../pages/Login';
import AuthorizationService from '../services/AuthorizationService';
import Register from '../pages/Register';

type loginMessage = 'Login' | 'Logout';

const Header: FunctionComponent = () => {
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
    const [loginMessage, setLoginMessage] = useState<loginMessage>(
        AuthorizationService.isAuthorized() ? 'Logout' : 'Login'
    );

    useEffect(() => {
        setLoginMessage(
            AuthorizationService.isAuthorized() ? 'Logout' : 'Login'
        );
    }, [isLoginModalOpen, isRegisterModalOpen]);

    const handleLogin = () => {
        AuthorizationService.isAuthorized()
            ? (() => {
                  AuthorizationService.logout();
                  setLoginMessage('Login');
              })()
            : setIsLoginModalOpen(true);
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
                <Typography variant='h6' component='div' sx={{ flexGrow: 1 }}>
                    Innowise Clinic
                </Typography>

                <Button onClick={() => handleLogin()} color='inherit'>
                    {loginMessage}
                </Button>

                <CustomizedModal
                    isOpen={isLoginModalOpen}
                    setModalOpen={setIsLoginModalOpen}
                >
                    <Login
                        setLoginModalOpen={setIsLoginModalOpen}
                        setRegisterModalOpen={setIsRegisterModalOpen}
                    />
                </CustomizedModal>

                <CustomizedModal
                    isOpen={isRegisterModalOpen}
                    setModalOpen={setIsRegisterModalOpen}
                >
                    <Register setModalOpen={setIsRegisterModalOpen} />
                </CustomizedModal>
            </Toolbar>
        </AppBar>
    );
};

export default Header;
