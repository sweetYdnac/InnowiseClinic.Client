import dayjs from 'dayjs';
import IGetTimeSlotsRequest from '../types/appointment/requests/IGetTimeSlotsRequest';
import ITimeSlotsResponse from '../types/appointment/responses/ITimeSlotsResponse';
import { getQueryString } from '../utils/functions';
import https from '../utils/https-common';
import ICreateAppointmentRequest from '../types/appointment/requests/ICreateAppointmentRequest';
import ICreatedResponse from '../types/authorization/responses/ICreatedResponse';

const getTimeSlots = async (data: IGetTimeSlotsRequest) => {
    let path = 'appointments/timeslots?' + getQueryString(data);
    let response = (await https.get<ITimeSlotsResponse>(path)).data;

    return {
        ...response,
        timeSlots: response.timeSlots.map((timeSlot) => {
            return {
                ...timeSlot,
                parsedTime: dayjs(timeSlot.time, 'HH:mm'),
            };
        }),
    } as ITimeSlotsResponse;
};

const create = async (data: ICreateAppointmentRequest) => {
    await https.post<ICreatedResponse>('appointments', data);
};

const AppointmentsService = {
    getTimeSlots,
    create,
};

export default AppointmentsService;
