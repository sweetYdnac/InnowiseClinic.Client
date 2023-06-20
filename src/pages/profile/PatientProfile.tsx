import { TabContext, TabList, TabPanel } from '@mui/lab';
import { Tab } from '@mui/material';
import { AxiosError } from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Loader from '../../components/Loader';
import { PopupData } from '../../components/Popup';
import { EventType } from '../../events/eventTypes';
import { eventEmitter } from '../../events/events';
import AppointmentsService from '../../services/appointments_api/AppointmentsService';
import AuthorizationService from '../../services/authorization_api/AuthorizationService';
import PhotosService from '../../services/documents_api/PhotosService';
import PatientsService from '../../services/profiles_api/PatientsService';
import IGetPatientHistoryRequest from '../../types/appointments_api/requests/IGetPatientHistoryRequest';
import IAppointmentHistoryResponse from '../../types/appointments_api/responses/IAppointmentHistoryResponse';
import { ModalNames } from '../../types/common/ModalNames';
import IPagedResponse from '../../types/common/responses/IPagedResponse';
import IUpdateProfileForm from '../../types/profiles_api/patients/IUpdatePatientProfileForm';
import PatientHistory from './PatientHistory';
import PatientInformation from './PatientInformation';

type PatientProfileTab = 'information' | 'history';

const appointmentsPagingDefaults = {
    currentPage: 1,
    pageSize: 10,
    totalCount: 1,
    totalPages: 1,
};

const PatientProfile = () => {
    const [activeTab, setActiveTab] = useState<PatientProfileTab>('information');
    const [profile, setProfile] = useState<IUpdateProfileForm | null>(null);
    const [appointments, setAppointments] = useState({
        ...appointmentsPagingDefaults,
        items: [],
    } as IPagedResponse<IAppointmentHistoryResponse>);
    const navigate = useNavigate();

    const handleError = useCallback(
        (error: any) => {
            if (error instanceof AxiosError && error.status === 400) {
                navigate('/');
                eventEmitter.emit(`${EventType.SHOW_POPUP}`, {
                    message: 'Unknown error occurred',
                } as PopupData);
            }
        },
        [navigate]
    );

    const getAppointments = useCallback(
        async (page: number = 1) => {
            const request = {
                currentPage: page,
                pageSize: appointments.pageSize,
            } as IGetPatientHistoryRequest;

            try {
                const response = await AppointmentsService.getPatientHistory(AuthorizationService.getAccountId(), request);
                setAppointments(response);
            } catch (error) {
                handleError(error);
            }
        },
        [appointments.pageSize, handleError]
    );

    const handleChangeTab = (e: React.SyntheticEvent<Element, Event>, value: PatientProfileTab) => {
        setActiveTab(value);

        if (value === 'history' && (appointments?.items?.length ?? 0) === 0) {
            getAppointments();
        }
    };

    const handleHistoryPageChange = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent> | null, page: number) => {
        await getAppointments(page + 1);
    };

    useEffect(() => {
        const getProfile = async () => {
            try {
                const { isActive, ...rest } = await PatientsService.getById(AuthorizationService.getAccountId());
                const values = rest as IUpdateProfileForm;
                if (values.photoId) {
                    const photo = await PhotosService.getById(values.photoId);
                    values.photo = photo;
                }

                setProfile(values);
            } catch (error) {
                handleError(error);
            }
        };

        getProfile();
    }, []);

    useEffect(() => {
        eventEmitter.addListener(`${EventType.CLOSE_MODAL} ${ModalNames.RescheduleAppointment}`, getAppointments);
        eventEmitter.addListener(`${EventType.CLOSE_MODAL} ${ModalNames.CreateAppointment}`, getAppointments);

        return () => {
            eventEmitter.removeListener(`${EventType.CLOSE_MODAL} ${ModalNames.RescheduleAppointment}`, getAppointments);
            eventEmitter.removeListener(`${EventType.CLOSE_MODAL} ${ModalNames.CreateAppointment}`, getAppointments);
        };
    }, [getAppointments]);

    return (
        <TabContext value={activeTab}>
            <TabList onChange={handleChangeTab} variant='fullWidth'>
                <Tab label={'Information'} value={'information' as PatientProfileTab} />
                <Tab label={'History'} value={'history' as PatientProfileTab} />
            </TabList>
            <TabPanel value={'information' as PatientProfileTab}>
                {profile ? <PatientInformation profile={profile} setProfile={setProfile} /> : <Loader isOpen={true} />}
            </TabPanel>
            <TabPanel value={'history' as PatientProfileTab}>
                {appointments.items.length > 0 ? (
                    <PatientHistory
                        appointments={appointments}
                        setAppointments={setAppointments}
                        handlePageChange={handleHistoryPageChange}
                    />
                ) : (
                    <Loader isOpen={true} />
                )}
            </TabPanel>
        </TabContext>
    );
};

export default PatientProfile;
