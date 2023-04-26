import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { InputAdornment } from '@mui/material';
import { LocalizationProvider, MobileTimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { FunctionComponent } from 'react';
import { Control, Controller } from 'react-hook-form';
import { EventType } from '../events/eventTypes';
import { eventEmitter } from '../events/events';
import ITimeSlot from '../types/appointments_api/ITimeSlot';

interface TimePickerProps {
    readOnly: boolean;
    disabled?: boolean;
    id: string;
    displayName: string;
    control: Control<any, any>;
    timeSlots: ITimeSlot[];
}

const TimePicker: FunctionComponent<TimePickerProps> = ({ readOnly, disabled, id, displayName, control, timeSlots }) => {
    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Controller
                name={id}
                control={control}
                render={({ field, fieldState }) => (
                    <>
                        <MobileTimePicker
                            {...field}
                            onOpen={() => eventEmitter.emit(`${EventType.OPEN_TIMEPICKER} ${id}`)}
                            disabled={disabled}
                            readOnly={readOnly}
                            label={displayName}
                            format='HH:mm'
                            minutesStep={10}
                            ampmInClock={true}
                            closeOnSelect={true}
                            shouldDisableTime={(value: dayjs.Dayjs, view) => {
                                if (view === 'hours') {
                                    return !timeSlots.some((slot) => slot.parsedTime.hour() === value.hour());
                                } else if (view === 'minutes') {
                                    return !timeSlots.some((slot) => slot.parsedTime.format('HH:mm') === value.format('HH:mm'));
                                }

                                return false;
                            }}
                            defaultValue={field?.value ?? null}
                            value={field?.value ?? null}
                            onChange={(time) => field.onChange(time)}
                            onAccept={(time) => {
                                field.onBlur();
                                eventEmitter.emit(`${EventType.TIMEPICKER_VALUE_CHANGE} ${id}`, time);
                            }}
                            onSelectedSectionsChange={() => field.onBlur()}
                            slotProps={{
                                textField: {
                                    sx: { m: 1, width: '75%' },
                                    color:
                                        (fieldState.error?.message?.length ?? 0) > 0 && (fieldState.isTouched || field.value)
                                            ? 'error'
                                            : 'success',
                                    focused: (fieldState.error?.message?.length ?? 0) === 0 && (fieldState.isTouched || !!field.value),
                                    variant: 'standard',
                                    helperText: fieldState.error?.message,
                                    error: (fieldState.error?.message?.length ?? 0) > 0 && (fieldState.isTouched || !!field.value),
                                    InputProps: {
                                        endAdornment: (
                                            <InputAdornment position='end'>
                                                <AccessTimeIcon />
                                            </InputAdornment>
                                        ),
                                    },
                                },
                            }}
                        />
                    </>
                )}
            />
        </LocalizationProvider>
    );
};

export default TimePicker;
