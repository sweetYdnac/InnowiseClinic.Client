import { Box } from '@mui/material';
import { FunctionComponent, useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../../components/Header';
import Popup from '../../components/Popup';
import Aside from '../../components/navigation/Aside';
import AuthorizationService from '../../services/AuthorizationService';

interface LayoutProps {}

const Layout: FunctionComponent<LayoutProps> = () => {
    const [isAuthorizated, setIsAuthorized] = useState(AuthorizationService.isAuthorized());

    useEffect(() => {
        const handleStorageChange = () => {
            setIsAuthorized(AuthorizationService.isAuthorized());
        };

        window.addEventListener('storage', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    return (
        <Box style={{ display: 'flex', flexDirection: 'column' }}>
            <Header />
            <Box sx={{ display: 'flex', flexDirection: 'row', height: '100%' }}>
                {isAuthorizated && <Aside />}
                <Box component='main' sx={{ flexGrow: 1, p: 3 }}>
                    <Outlet />
                </Box>
            </Box>

            <Popup />
        </Box>
    );
};

export default Layout;
