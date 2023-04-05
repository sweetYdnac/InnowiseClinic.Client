import TextField from '@mui/material/TextField';
import { FunctionComponent, useState } from 'react';
import { AccountCircle } from '@mui/icons-material';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';

interface EmailAddressInputProps {
    isTouched: boolean | undefined;
    name?: string;
    errors: string | undefined;
    handleChange: (e: React.ChangeEvent<any>) => void;
    handleBlur: (e: any) => void;
}

const EmailAddressInput: FunctionComponent<EmailAddressInputProps> = ({
    isTouched,
    name = 'email',
    errors,
    handleChange,
    handleBlur,
}: EmailAddressInputProps) => {
    return (
        <FormControl
            sx={{ m: 1, width: '75%' }}
            variant='standard'
            error={(errors?.length ?? 0) > 0 && isTouched}
        >
            <TextField
                id={name}
                required
                label={
                    (errors?.length ?? 0) > 0 && isTouched
                        ? 'Error'
                        : 'Email address'
                }
                placeholder='example@gmail.com'
                variant='standard'
                error={(errors?.length ?? 0) > 0 && isTouched}
                helperText={isTouched ? errors : ''}
                onChange={(e) => handleChange(e)}
                onBlur={(e) => handleBlur(e)}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position='start'>
                            <AccountCircle />
                        </InputAdornment>
                    ),
                }}
            />
        </FormControl>
    );
};

export default EmailAddressInput;
