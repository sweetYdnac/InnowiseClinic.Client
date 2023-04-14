import dayjs from 'dayjs';
import { FunctionComponent, useEffect, useState } from 'react';
import { EventType } from '../events/eventTypes';
import { eventEmitter } from '../events/events';
import AppointmentsService from '../services/AppointmentsService';
import ITimeSlot from '../types/appointment/ITimeSlot';
import IGetTimeSlotsRequest from '../types/appointment/requests/IGetTimeSlotsRequest';
import TimeSlot from './TimeSlot';

interface TimeSlotsProps {
    isActive: boolean;
    date: dayjs.Dayjs;
    doctors: string[];
    duration: number;
}

const TimeSlots: FunctionComponent<TimeSlotsProps> = ({
    isActive,
    date,
    doctors,
    duration,
}) => {
    const [timeSlots, setTimeSlots] = useState<ITimeSlot[]>();
    const [selectedTimeSlot, setSelectedTimeSlot] = useState<ITimeSlot>();

    useEffect(() => {
        if (isActive) {
            const request = async () => {
                let data = {
                    date: date.format('YYYY-MM-DD'),
                    doctors: doctors,
                    duration: duration,
                    startTime: '08:00',
                    endTime: '18:00',
                } as IGetTimeSlotsRequest;

                let response = await AppointmentsService.getTimeSlots(data);
                console.log(response);
                setTimeSlots(response.timeSlots);
            };

            request();
        }
    }, [date, doctors, duration, isActive]);

    useEffect(() => {
        eventEmitter.addListener(
            EventType.ENTER_TIMESLOT,
            (data: ITimeSlot) => {
                setSelectedTimeSlot(data);
            }
        );

        return () => {
            eventEmitter.removeListener(
                EventType.ENTER_TIMESLOT,
                (data: ITimeSlot) => {
                    setSelectedTimeSlot(data);
                }
            );
        };
    }, []);

    return (
        <>
            {isActive &&
                (timeSlots?.length ?? 0) > 0 &&
                timeSlots?.map((timeSlot) => (
                    <TimeSlot
                        key={timeSlot.time}
                        data={timeSlot}
                        isSelected={timeSlot === selectedTimeSlot}
                    />
                ))}
        </>
    );
};

export default TimeSlots;
