import dayjs from 'dayjs';

export default interface IRescheduledAppointmentDTO {
    id: string;
    date: dayjs.Dayjs;
    startTime: dayjs.Dayjs;
    endTime: dayjs.Dayjs;
    doctorFullName: string;
}
