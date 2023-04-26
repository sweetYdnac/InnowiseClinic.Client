export default interface IAppointmentResultResponse {
    id: string;
    date: string;
    patientFullName: string;
    patientDateOfBirth: string;
    doctorId: string;
    doctorFullName: string;
    doctorSpecializationName: string;
    serviceName: string;
    complaints: string;
    conclusion: string;
    recommendations: string;
}
