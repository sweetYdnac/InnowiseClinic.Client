import dayjs from 'dayjs';

export default interface ITimeSlot {
    time: dayjs.Dayjs;
    doctorsId: string[];
}
