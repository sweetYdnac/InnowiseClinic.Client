import dayjs from 'dayjs';

export default interface IUpdateProfileForm {
    firstName: string;
    lastName: string;
    middleName?: string;
    dateOfBirth: dayjs.Dayjs;
    phoneNumber: string;
    photoId: string;
    photo: string;
}
