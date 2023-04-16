import { FunctionComponent, useEffect, useState } from 'react';
import { EventType } from '../events/eventTypes';
import { eventEmitter } from '../events/events';
import ITimeSlot from '../types/appointment/ITimeSlot';
import TimeSlot from './TimeSlot';

interface TimeSlotsProps {
    timeSlots: ITimeSlot[];
}

const TimeSlots: FunctionComponent<TimeSlotsProps> = ({ timeSlots }) => {
    const [selectedTimeSlot, setSelectedTimeSlot] = useState<ITimeSlot>();

    useEffect(() => {
        eventEmitter.addListener(EventType.ENTER_TIMESLOT, (data: ITimeSlot) => {
            setSelectedTimeSlot(data);
        });

        return () => {
            eventEmitter.removeListener(EventType.ENTER_TIMESLOT, (data: ITimeSlot) => {
                setSelectedTimeSlot(data);
            });
        };
    }, []);

    return (
        <>
            {(timeSlots?.length ?? 0) > 0 &&
                timeSlots?.map((timeSlot) => <TimeSlot key={timeSlot.time} data={timeSlot} isSelected={timeSlot === selectedTimeSlot} />)}
        </>
    );
};

export default TimeSlots;
