import dayjs from 'dayjs';

export default interface IAppointmentHistoryResponse {
    id: string;
    date: dayjs.Dayjs;
    startTime: dayjs.Dayjs;
    endTime: dayjs.Dayjs;
    doctorFullName: string;
    serviceName: string;
    resultId: string | null;
    isApproved: boolean;
}
