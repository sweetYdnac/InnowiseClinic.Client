import dayjs from 'dayjs';
import ICreateAppointmentRequest from '../../types/appointments_api/requests/ICreateAppointmentRequest';
import IGetPatientHistoryRequest from '../../types/appointments_api/requests/IGetPatientHistoryRequest';
import IGetTimeSlotsRequest from '../../types/appointments_api/requests/IGetTimeSlotsRequest';
import IAppointmentHistoryResponse from '../../types/appointments_api/responses/IAppointmentHistoryResponse';
import ITimeSlotsResponse from '../../types/appointments_api/responses/ITimeSlotsResponse';
import ICreatedResponse from '../../types/authorization_api/responses/ICreatedResponse';
import IPagedResponse from '../../types/common/responses/IPagedResponse';
import { getQueryString } from '../../utils/functions';
import https from '../../utils/https-common';

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

const create = async (data: ICreateAppointmentRequest) => {
    await https.post<ICreatedResponse>('appointments', data);
};

const getPatientHistory = async (id: string, data: IGetPatientHistoryRequest) => {
    const path = `/patients/${id}/appointments?` + getQueryString(data);
    const response = (await https.get<IPagedResponse<IAppointmentHistoryResponse>>(path)).data;

    return {
        ...response,
        items: response.items.map((item) => {
            return {
                ...item,
                date: dayjs(item.date, 'yyyy-MM-dd'),
                startTime: dayjs(item.startTime, 'HH:mm'),
                endTime: dayjs(item.endTime, 'HH:mm'),
            };
        }),
    } as IPagedResponse<IAppointmentHistoryResponse>;
};

const AppointmentsService = {
    getTimeSlots,
    create,
    getPatientHistory,
};

export default AppointmentsService;
