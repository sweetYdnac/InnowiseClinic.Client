import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { InputAdornment } from '@mui/material';
import { LocalizationProvider, MobileTimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { FunctionComponent } from 'react';
import { Control, Controller } from 'react-hook-form';
import ITimeSlot from '../types/appointment/ITimeSlot';

interface TimePickerProps {
    readOnly: boolean;
    disabled?: boolean;
    id: string;
    displayName: string;
    isTouched: boolean | undefined;
    errors: string | undefined;
    control: Control<any, any>;
    timeSlots: ITimeSlot[];
}

const TimePicker: FunctionComponent<TimePickerProps> = ({ readOnly, disabled, id, displayName, isTouched, errors, control, timeSlots }) => {
    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Controller
                name={id}
                control={control}
                defaultValue=''
                render={({ field }) => (
                    <>
                        <MobileTimePicker
                            {...field}
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
                            defaultValue={field?.value?.parsedTime ?? null}
                            value={field?.value?.parsedTime ?? null}
                            onChange={(date) => field.onChange(timeSlots.find((slot) => slot.time === date?.format('HH:mm')))}
                            onAccept={() => field.onBlur()}
                            onSelectedSectionsChange={() => field.onBlur()}
                            slotProps={{
                                textField: {
                                    sx: { m: 1, width: '75%' },
                                    color: (errors?.length ?? 0) > 0 && isTouched ? 'error' : 'success',
                                    focused: (errors?.length ?? 0) === 0 && isTouched,
                                    variant: 'standard',
                                    helperText: isTouched ? errors : '',
                                    error: (errors?.length ?? 0) > 0 && isTouched,
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
