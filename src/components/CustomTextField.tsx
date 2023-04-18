import TextField from '@mui/material/TextField';
import { FunctionComponent, ReactNode } from 'react';
import { UseFormRegisterReturn } from 'react-hook-form';
import { WorkMode } from '../types/common/WorkMode';
import { InputAdornment } from '@mui/material';

interface CustomTextFieldProps {
    workMode: WorkMode;
    displayName: string;
    isTouched: boolean | undefined;
    errors: string | undefined;
    register: UseFormRegisterReturn<string>;
    inputMode: 'text' | 'numeric';
    startAdornment?: ReactNode;
    endAdornment?: ReactNode;
}

const CustomTextfield: FunctionComponent<CustomTextFieldProps> = ({
    workMode,
    displayName,
    isTouched,
    errors,
    register,
    inputMode,
    startAdornment,
    endAdornment,
}: CustomTextFieldProps) => {
    return (
        <TextField
            sx={{ m: 1, width: '75%' }}
            color={workMode === 'edit' && (errors?.length ?? 0) > 0 && isTouched ? 'error' : 'success'}
            focused={workMode === 'edit' && (errors?.length ?? 0) === 0 && isTouched}
            {...register}
            label={workMode === 'view' ? displayName : (errors?.length ?? 0) > 0 && isTouched ? 'Error' : displayName}
            variant='standard'
            error={workMode === 'edit' && (errors?.length ?? 0) > 0 && isTouched}
            helperText={workMode === 'edit' && isTouched ? errors : ''}
            InputProps={{
                readOnly: workMode === 'view',
                inputMode: inputMode,
                startAdornment: <InputAdornment position='start'>{startAdornment}</InputAdornment>,
                endAdornment: <InputAdornment position='start'>{endAdornment}</InputAdornment>,
            }}
            InputLabelProps={{
                shrink: true,
            }}
        />
    );
};

export default CustomTextfield;
