import { InputAdornment } from '@mui/material';
import TextField from '@mui/material/TextField';
import { FunctionComponent, ReactNode } from 'react';
import { Control, Controller } from 'react-hook-form';
import { WorkMode } from '../types/common/WorkMode';

interface CustomTextFieldProps {
    id: string;
    displayName: string;
    control: Control<any, any>;
    inputMode: 'text' | 'numeric';
    workMode?: WorkMode;
    startAdornment?: ReactNode;
    endAdornment?: ReactNode;
}

const CustomFormTextfield: FunctionComponent<CustomTextFieldProps> = ({
    id,
    displayName,
    control,
    inputMode,
    workMode = 'view',
    startAdornment,
    endAdornment,
}: CustomTextFieldProps) => {
    if (workMode === 'view') {
        return (
            <Controller
                name={id}
                control={control}
                defaultValue=''
                render={({ field }) => (
                    <>
                        <TextField
                            {...field}
                            sx={{ m: 1, width: '75%' }}
                            label={displayName}
                            variant='standard'
                            InputProps={{
                                readOnly: true,
                                inputMode: inputMode,
                                startAdornment: <InputAdornment position='start'>{startAdornment}</InputAdornment>,
                                endAdornment: <InputAdornment position='start'>{endAdornment}</InputAdornment>,
                            }}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                    </>
                )}
            />
        );
    } else if (workMode === 'edit') {
        return (
            <Controller
                name={id}
                control={control}
                defaultValue=''
                render={({ field, fieldState }) => (
                    <>
                        <TextField
                            {...field}
                            sx={{ m: 1, width: '75%' }}
                            color={
                                (fieldState.error?.message?.length ?? 0) > 0 && (fieldState.isTouched || field.value) ? 'error' : 'success'
                            }
                            focused={(fieldState.error?.message?.length ?? 0) === 0 && (fieldState.isTouched || !!field.value)}
                            label={(fieldState.error?.message?.length ?? 0) > 0 && fieldState.isTouched ? 'Error' : displayName}
                            variant='standard'
                            error={(fieldState.error?.message?.length ?? 0) > 0 && (fieldState.isTouched || !!field.value)}
                            helperText={fieldState.error?.message}
                            InputProps={{
                                readOnly: false,
                                inputMode: inputMode,
                                startAdornment: <InputAdornment position='start'>{startAdornment}</InputAdornment>,
                                endAdornment: <InputAdornment position='start'>{endAdornment}</InputAdornment>,
                            }}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                    </>
                )}
            />
        );
    }

    return <></>;
};

export default CustomFormTextfield;
