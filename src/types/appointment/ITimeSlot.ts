import dayjs from 'dayjs';

export default interface ITimeSlot {
    doctorsId: string[];
    time: string;
    parsedTime: dayjs.Dayjs;
}
