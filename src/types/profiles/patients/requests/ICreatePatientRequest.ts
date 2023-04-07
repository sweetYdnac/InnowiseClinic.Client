export default interface ICreatePatientRequest {
    id: string;
    firstName: string;
    lastName: string;
    middleName?: string;
    dateOfBirth: string;
    phoneNumber: string;
    photoId?: string;
}
