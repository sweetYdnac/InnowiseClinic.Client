import {
    DatePicker,
    DateView,
    LocalizationProvider,
} from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { FunctionComponent } from 'react';
import { Control, Controller } from 'react-hook-form';
import { WorkMode } from '../pages/profile/Profile';
import dayjs from 'dayjs';

interface DatepickerProps {
    workMode: WorkMode;
    id: string;
    displayName: string;
    isTouched: boolean | undefined;
    errors: string | undefined;
    control: Control<any, any>;
    disableFuture?: boolean;
    disablePast?: boolean;
    views?: DateView[];
    openTo?: DateView;
}

const Datepicker: FunctionComponent<DatepickerProps> = ({
    workMode,
    id,
    displayName,
    isTouched,
    errors,
    control,
    disableFuture = true,
    disablePast = false,
    views = ['year', 'month', 'day'],
    openTo = 'year',
}: DatepickerProps) => {
    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Controller
                name={id}
                control={control}
                render={({ field }) => (
                    <>
                        <DatePicker
                            readOnly={workMode === 'view'}
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
                            slotProps={{
                                textField: {
                                    variant: 'standard',
                                    helperText: isTouched ? errors : '',
                                    error:
                                        (errors?.length ?? 0) > 0 && isTouched,
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
