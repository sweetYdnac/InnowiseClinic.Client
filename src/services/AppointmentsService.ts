import IGetTimeSlotsRequest from '../types/appointment/requests/IGetTimeSlotsRequest';
import ITimeSlotsResponse from '../types/appointment/responses/ITimeSlotsResponse';
import { getQueryString } from '../utils/functions';
import https from '../utils/https-common';

const getTimeSlots = async (data: IGetTimeSlotsRequest) => {
    let path = 'appointments/timeslots?' + getQueryString(data);

    return (await https.get<ITimeSlotsResponse>(path)).data;
};

const AppointmentsService = {
    getTimeSlots,
};

export default AppointmentsService;
