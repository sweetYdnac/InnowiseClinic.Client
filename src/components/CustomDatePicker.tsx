import { DatePicker, DateView, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { FunctionComponent } from 'react';
import { Control, Controller } from 'react-hook-form';

interface DatepickerProps {
    readOnly: boolean;
    id: string;
    displayName: string;
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
                render={({ field, fieldState }) => (
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
                                    color:
                                        !readOnly && (fieldState.error?.message?.length ?? 0) > 0 && (fieldState.isTouched || field.value)
                                            ? 'error'
                                            : 'success',
                                    focused:
                                        !readOnly &&
                                        (fieldState.error?.message?.length ?? 0) === 0 &&
                                        (fieldState.isTouched || !!field.value),
                                    variant: 'standard',
                                    helperText: fieldState.error?.message,
                                    error: (fieldState.error?.message?.length ?? 0) > 0 && (fieldState.isTouched || field.value),
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
