import dayjs from 'dayjs';

import ITimeSlot from '../ITimeSlot';

export default interface ICreateAppointmentForm {
    officeId: string | null;
    doctorId: string | null;
    specializationId: string | null;
    serviceId: string | null;
    date: dayjs.Dayjs;
    time: dayjs.Dayjs | null;
}
