import dayjs from 'dayjs';

export default interface IAppointmentHistoryResponse {
    date: dayjs.Dayjs;
    startTime: dayjs.Dayjs;
    endTime: dayjs.Dayjs;
    doctorFullName: string;
    serviceName: string;
    resultId: string | null;
}
