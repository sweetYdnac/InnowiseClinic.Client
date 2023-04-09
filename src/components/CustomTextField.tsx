import TextField from '@mui/material/TextField';
import { FunctionComponent } from 'react';
import FormControl from '@mui/material/FormControl';
import { WorkMode } from './Profile';
import { UseFormRegisterReturn } from 'react-hook-form';

interface CustomTextFieldProps {
    workMode: WorkMode;
    displayName: string;
    isTouched: boolean | undefined;
    errors: string | undefined;
    register: UseFormRegisterReturn<string>;
}

const CustomTextField: FunctionComponent<CustomTextFieldProps> = ({
    workMode,
    displayName,
    isTouched,
    errors,
    register,
}: CustomTextFieldProps) => {
    return (
        <FormControl
            sx={{ m: 1, width: '75%' }}
            variant='standard'
            error={
                workMode === 'edit' && (errors?.length ?? 0) > 0 && isTouched
            }
        >
            <TextField
                {...register}
                label={
                    workMode === 'view'
                        ? displayName
                        : (errors?.length ?? 0) > 0 && isTouched
                        ? 'Error'
                        : displayName
                }
                variant='standard'
                error={
                    workMode === 'edit' &&
                    (errors?.length ?? 0) > 0 &&
                    isTouched
                }
                helperText={workMode === 'edit' && isTouched ? errors : ''}
                InputProps={{
                    readOnly: workMode === 'view',
                }}
                InputLabelProps={{
                    shrink: true,
                }}
            />
        </FormControl>
    );
};

export default CustomTextField;
