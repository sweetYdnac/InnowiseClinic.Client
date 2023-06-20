import dayjs from 'dayjs';

export default interface ITimeSlot {
    doctors: string[];
    time: string;
    parsedTime: dayjs.Dayjs;
}
