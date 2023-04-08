import TextField from '@mui/material/TextField';
import { FunctionComponent, useState } from 'react';
import FormControl from '@mui/material/FormControl';
import { WorkMode } from './Profile';

interface CustomTextFieldProps {
    workMode: WorkMode;
    id: string;
    displayName: string;
    value: string | undefined;
    isTouched: boolean | undefined;
    errors: string | undefined;
    handleChange: (e: React.ChangeEvent<any>) => void;
    handleBlur: (e: any) => void;
}

const CustomTextField: FunctionComponent<CustomTextFieldProps> = ({
    workMode,
    id,
    displayName,
    value,
    isTouched,
    errors,
    handleChange,
    handleBlur,
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
                id={id}
                label={
                    workMode === 'view'
                        ? displayName
                        : (errors?.length ?? 0) > 0 && isTouched
                        ? 'Error'
                        : displayName
                }
                defaultValue={value}
                placeholder={displayName}
                variant='outlined'
                error={
                    workMode === 'edit' &&
                    (errors?.length ?? 0) > 0 &&
                    isTouched
                }
                helperText={workMode === 'edit' && isTouched ? errors : ''}
                onChange={(e) => handleChange(e)}
                onBlur={(e) => handleBlur(e)}
                InputProps={{
                    readOnly: workMode === 'view',
                }}
            />
        </FormControl>
    );
};

export default CustomTextField;
