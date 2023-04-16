import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { InputAdornment } from '@mui/material';
import { LocalizationProvider, MobileTimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { FunctionComponent } from 'react';
import { Control, Controller } from 'react-hook-form';

interface TimePickerProps {
    readOnly: boolean;
    disabled?: boolean;
    id: string;
    displayName: string;
    isTouched: boolean | undefined;
    errors: string | undefined;
    control: Control<any, any>;
}

const TimePicker: FunctionComponent<TimePickerProps> = ({ readOnly, disabled, id, displayName, isTouched, errors, control }) => {
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
                            minTime={dayjs('08:00', 'HH:mm')}
                            maxTime={dayjs('18:00', 'HH:mm')}
                            defaultValue={field.value as dayjs.Dayjs}
                            value={field.value as dayjs.Dayjs}
                            onChange={(date) => field.onChange(date)}
                            onAccept={() => field.onBlur()}
                            onSelectedSectionsChange={() => field.onBlur()}
                            slotProps={{
                                textField: {
                                    sx: { m: 1, width: '75%' },
                                    color: !readOnly && (errors?.length ?? 0) > 0 && isTouched ? 'error' : 'success',
                                    focused: !readOnly && (errors?.length ?? 0) === 0 && isTouched,
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
