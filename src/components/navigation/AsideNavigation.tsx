import AddCircleIcon from '@mui/icons-material/AddCircle';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import MonitorHeartIcon from '@mui/icons-material/MonitorHeart';
import { Divider, List } from '@mui/material';
import { FunctionComponent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { EventType } from '../../events/eventTypes';
import { eventEmitter } from '../../events/events';
import ProtectedRoute from '../../utils/ProtectedRoute';
import CustomizedModal from '../customizedModal/CustomizedModal';
import CreateAppointment from '../forms/CreateAppointment';
import AsideItem from './AsideItem';
const createAppointmentModalEventMessage = 'createAppointment';

interface AsideNavigationProps {}

const AsideNavigation: FunctionComponent<AsideNavigationProps> = () => {
    const [isCreateAppointmentModalOpen, setIsCreateAppointmentModalOpen] = useState(false);
    const navigate = useNavigate();

    const handleCreateAppointment = () => {
        setIsCreateAppointmentModalOpen(true);
    };

    useEffect(() => {
        const closeCreateAppointmentModal = () => {
            setIsCreateAppointmentModalOpen(false);
        };

        eventEmitter.addListener(`${EventType.CLOSE_MODAL} ${createAppointmentModalEventMessage}`, closeCreateAppointmentModal);
        eventEmitter.addListener(`${EventType.SUBMIT_DIALOG} ${createAppointmentModalEventMessage}`, closeCreateAppointmentModal);

        return () => {
            eventEmitter.removeListener(`${EventType.CLOSE_MODAL} ${createAppointmentModalEventMessage}`, closeCreateAppointmentModal);
            eventEmitter.removeListener(`${EventType.SUBMIT_DIALOG} ${createAppointmentModalEventMessage}`, closeCreateAppointmentModal);
        };
    }, []);

    return (
        <>
            <List>
                <AsideItem displayName='Create Appointment' handleClick={handleCreateAppointment}>
                    <AddCircleIcon />
                </AsideItem>
                <Divider variant='middle' />
                <AsideItem displayName='Profile' handleClick={() => navigate('/profile')}>
                    <ManageAccountsIcon />
                </AsideItem>
                <Divider variant='middle' />
                <AsideItem displayName='Doctors' handleClick={() => navigate('/doctors')}>
                    <MonitorHeartIcon />
                </AsideItem>
                <AsideItem displayName='Services' handleClick={() => navigate('/services')}>
                    <MedicalServicesIcon />
                </AsideItem>
            </List>

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

export default AsideNavigation;
