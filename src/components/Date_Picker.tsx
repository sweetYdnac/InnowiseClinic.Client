import { DatePicker, DateView, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { FunctionComponent } from 'react';
import { Control, Controller } from 'react-hook-form';

interface DatepickerProps {
    readOnly: boolean;
    id: string;
    displayName: string;
    isTouched: boolean | undefined;
    errors: string | undefined;
    control: Control<any, any>;
    disableFuture?: boolean;
    disablePast?: boolean;
    views?: DateView[];
    openTo?: DateView;
    disabled?: boolean;
}

const Datepicker: FunctionComponent<DatepickerProps> = ({
    readOnly,
    id,
    displayName,
    isTouched,
    errors,
    control,
    disableFuture = true,
    disablePast = false,
    views = ['year', 'month', 'day'],
    openTo = 'year',
    disabled = false,
}: DatepickerProps) => {
    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Controller
                name={id}
                control={control}
                defaultValue=''
                render={({ field }) => (
                    <>
                        <DatePicker
                            disabled={disabled}
                            readOnly={readOnly}
                            disableFuture={disableFuture}
                            disablePast={disablePast}
                            label={displayName}
                            views={views}
                            openTo={openTo}
                            format='DD MMMM YYYY'
                            {...field}
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
                                },
                                popper: {
                                    placement: 'auto',
                                },
                            }}
                        />
                    </>
                )}
            />
        </LocalizationProvider>
    );
};

export default Datepicker;
