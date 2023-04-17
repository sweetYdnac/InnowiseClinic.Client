import { InputAdornment, TextField } from '@mui/material';
import { FunctionComponent } from 'react';
import { UseFormRegisterReturn } from 'react-hook-form';
import { WorkMode } from '../types/common/WorkMode';

interface NumericTextfieldProps {
    workMode: WorkMode;
    displayName: string;
    isTouched: boolean | undefined;
    errors: string | undefined;
    register: UseFormRegisterReturn<string>;
}

const NumericTextfield: FunctionComponent<NumericTextfieldProps> = ({
    workMode,
    displayName,
    isTouched,
    errors,
    register,
}: NumericTextfieldProps) => {
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
                startAdornment: <InputAdornment position='start'>+</InputAdornment>,
                readOnly: workMode === 'view',
                inputMode: 'numeric',
            }}
            InputLabelProps={{
                shrink: true,
            }}
        />
    );
};

export default NumericTextfield;
