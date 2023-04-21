import { FunctionComponent, useEffect, useState } from 'react';
import PatientHistory from '../../components/PatientsHistory';
import AppointmentsService from '../../services/appointments_api/AppointmentsService';
import AuthorizationService from '../../services/authorization_api/AuthorizationService';
import IGetPatientHistoryRequest from '../../types/appointments_api/requests/IGetPatientHistoryRequest';
import IAppointmentHistoryResponse from '../../types/appointments_api/responses/IAppointmentHistoryResponse';
import IPagedResponse from '../../types/common/responses/IPagedResponse';

const Home: FunctionComponent = () => {
    const [appoints, setAppoints] = useState({} as IPagedResponse<IAppointmentHistoryResponse>);

    const appointments = async () => {
        const request: IGetPatientHistoryRequest = {
            currentPage: 1,
            pageSize: 20,
        };

        const response = await AppointmentsService.getPatientHistory(AuthorizationService.getAccountId(), request);

        setAppoints(response);
    };

    useEffect(() => {
        appointments();
    }, []);

    return (
        <>
            <div>Hello it's home page!</div>
            {(appoints?.items?.length ?? 0 > 0) && <PatientHistory options={appoints.items} />}
        </>
    );
};

export default Home;
