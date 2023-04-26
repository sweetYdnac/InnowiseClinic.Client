import dayjs from 'dayjs';
import ICreateAppointmentRequest from '../../types/appointments_api/requests/ICreateAppointmentRequest';
import IGetPatientHistoryRequest from '../../types/appointments_api/requests/IGetPatientHistoryRequest';
import IGetTimeSlotsRequest from '../../types/appointments_api/requests/IGetTimeSlotsRequest';
import IRescheduleAppointmentRequest from '../../types/appointments_api/requests/IRescheduleAppointmentRequest';
import IAppointmentHistoryResponse from '../../types/appointments_api/responses/IAppointmentHistoryResponse';
import IRescheduleAppointmentResponse from '../../types/appointments_api/responses/IRescheduleAppointmentResponse';
import ITimeSlotsResponse from '../../types/appointments_api/responses/ITimeSlotsResponse';
import ICreatedResponse from '../../types/authorization_api/responses/ICreatedResponse';
import IPagedResponse from '../../types/common/responses/IPagedResponse';
import { getQueryString } from '../../utils/functions';
import https from '../../utils/https-common';

const getById = async (id: string) => {
    return (await https.get<IRescheduleAppointmentResponse>(`/appointments/${id}`)).data;
};

const getTimeSlots = async (data: IGetTimeSlotsRequest) => {
    const path = 'appointments/timeslots?' + getQueryString(data);
    const response = (await https.get<ITimeSlotsResponse>(path)).data;

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

const getPatientHistory = async (id: string, data: IGetPatientHistoryRequest) => {
    const path = `/patients/${id}/appointments?` + getQueryString(data);
    const response = (await https.get<IPagedResponse<IAppointmentHistoryResponse>>(path)).data;

    return {
        ...response,
        items: response.items.map((item) => {
            return {
                ...item,
                date: dayjs(item.date, 'YYYY-MM-DD'),
                startTime: dayjs(item.startTime, 'HH:mm'),
                endTime: dayjs(item.endTime, 'HH:mm'),
            };
        }),
    } as IPagedResponse<IAppointmentHistoryResponse>;
};

const create = async (data: ICreateAppointmentRequest) => {
    return (await https.post<ICreatedResponse>('appointments', data)).data;
};

const reschedule = async (id: string, data: IRescheduleAppointmentRequest) => {
    await https.put(`/appointments/${id}`, data);
};

const AppointmentsService = {
    getById,
    getTimeSlots,
    getPatientHistory,
    create,
    reschedule,
};

export default AppointmentsService;
