export default interface ICreateProfileRequest {
    id: string;
    firstName: string;
    lastName: string;
    middleName?: string;
    dateOfBirth: string;
    phoneNumber: string;
    photoId?: string;
}
