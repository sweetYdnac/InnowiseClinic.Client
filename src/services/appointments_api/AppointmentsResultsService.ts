import IAppointmentResultResponse from '../../types/appointments_api/responses/IAppointmentResultResponse';
import https from '../../utils/https-common';

const getById = async (id: string) => {
    return (await https.get<IAppointmentResultResponse>(`/appointments/results/${id}`)).data;
};

const AppointmentsResultsService = {
    getById,
};

export default AppointmentsResultsService;
