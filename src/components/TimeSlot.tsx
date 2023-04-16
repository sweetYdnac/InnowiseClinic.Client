import { Button } from '@mui/material';
import { FunctionComponent } from 'react';
import { EventType } from '../events/eventTypes';
import { eventEmitter } from '../events/events';
import ITimeSlot from '../types/appointment/ITimeSlot';

interface TimeSlotProps {
    data: ITimeSlot;
    isSelected: boolean;
}

const TimeSlot: FunctionComponent<TimeSlotProps> = ({ data, isSelected }) => {
    const handleClick = () => {
        if (!isSelected) {
            eventEmitter.emit(EventType.ENTER_TIMESLOT, data);
        }
    };

    return (
        <Button onClick={handleClick} variant='contained' color={isSelected ? 'info' : 'secondary'} sx={{ borderRadius: 28 }}>
            {data.time.toDate().toString()}
        </Button>
    );
};

export default TimeSlot;
