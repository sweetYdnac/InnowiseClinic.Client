export default interface IRescheduleAppointmentRequest {
    doctorId: string;
    doctorFullName: string;
    date: string; // YYYY-MM-DD
    time: string; // HH:mm
}
