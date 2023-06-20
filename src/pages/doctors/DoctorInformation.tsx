import { Box, Button, List, ListItem, ListItemText, ListSubheader } from '@mui/material';
import { FunctionComponent, useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import Loader from '../../components/Loader';
import ReadonlyTextField from '../../components/ReadonlyTextField';
import CustomizedModal from '../../components/customizedModal/CustomizedModal';
import CreateAppointment from '../../components/forms/CreateAppointment';
import { EventType } from '../../events/eventTypes';
import { eventEmitter } from '../../events/events';
import ServicesService from '../../services/services_api/ServicesService';
import IDoctorInformationDTO from '../../types/profiles_api/doctors/IDoctorInformationDTO';
import IGetPagedServicesRequest from '../../types/services_api/requests/service/IGetPagedServicesRequest';
import ProtectedRoute from '../../utils/ProtectedRoute';

const createAppointmentModalEventMessage = 'createAppointment';

interface DoctorInformationProps {}

const DoctorInformation: FunctionComponent<DoctorInformationProps> = () => {
    const { id } = useParams();
    const location = useLocation();
    const dto = location.state as IDoctorInformationDTO;
    const [services, setServices] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isCreateAppointmentModalOpen, setIsCreateAppointmentModalOpen] = useState(false);

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

    useEffect(() => {
        const getServices = async () => {
            setIsLoading(true);
            const request = {
                currentPage: 1,
                pageSize: 50,
                isActive: true,
                specializationId: dto.specializationId,
            } as IGetPagedServicesRequest;

            setServices((await ServicesService.getPaged(request)).items.map((item) => item.title));
            setIsLoading(false);
        };

        getServices();
    }, [dto.specializationId]);

    return (
        <>
            {isLoading ? (
                <Loader isOpen={isLoading} />
            ) : (
                <Box>
                    <Box display={'flex'} justifyContent={'space-evenly'}>
                        <img width='300' alt='doctor' src={dto.photo} />
                        <Button onClick={handleCreateAppointment}>Create appointment with doctor</Button>
                    </Box>
                    <ReadonlyTextField displayName='Full name' value={dto.fullName} />
                    <ReadonlyTextField displayName='Office address' value={dto.officeAddress} />
                    <ReadonlyTextField displayName='Experience' value={dto.experience} endAdornment={'years'} />
                    <ReadonlyTextField displayName='Specialization' value={dto.specialization} />

                    <List subheader={<ListSubheader component='div'>Services</ListSubheader>} dense>
                        {services.map((item, index) => (
                            <ListItem key={index}>
                                <ListItemText primary={item} inset />
                            </ListItem>
                        ))}
                    </List>
                </Box>
            )}

            {isCreateAppointmentModalOpen && (
                <CustomizedModal isOpen={isCreateAppointmentModalOpen} name={createAppointmentModalEventMessage}>
                    <ProtectedRoute>
                        <CreateAppointment
                            modalName={createAppointmentModalEventMessage}
                            dto={{
                                doctorId: id ?? '',
                                doctorFullName: dto.fullName,
                                specializationId: dto.specializationId,
                                specializationName: dto.specialization,
                                officeId: dto.officeId,
                                officeAddress: dto.officeAddress,
                            }}
                        />
                    </ProtectedRoute>
                </CustomizedModal>
            )}
        </>
    );
};

export default DoctorInformation;
