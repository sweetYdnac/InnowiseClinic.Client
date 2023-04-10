import dayjs from 'dayjs';

export default interface IProfileResponse {
    firstName: string;
    lastName: string;
    middleName?: string;
    dateOfBirth: dayjs.Dayjs;
    phoneNumber: string;
    photoId?: string;
}
