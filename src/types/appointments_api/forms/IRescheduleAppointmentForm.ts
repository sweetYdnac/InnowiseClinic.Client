import dayjs from 'dayjs';

export default interface IRescheduleAppointmentForm {
    doctorId: string | null;
    date: dayjs.Dayjs;
    time: dayjs.Dayjs | null;
}
