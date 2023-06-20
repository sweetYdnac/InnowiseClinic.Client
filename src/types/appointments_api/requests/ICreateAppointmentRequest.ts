export default interface ICreateAppointmentRequest {
    patientId: string;
    patientFullName: string;
    patientPhoneNumber: string;
    patientDateOfBirth: string;
    doctorId: string;
    doctorFullName: string;
    specializationId: string;
    doctorSpecializationName: string;
    serviceId: string;
    serviceName: string;
    duration: number;
    officeId: string;
    officeAddress: string;
    date: string;
    time: string;
}
