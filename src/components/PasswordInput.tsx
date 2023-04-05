import { Visibility, VisibilityOff } from '@mui/icons-material';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import IconButton from '@mui/material/IconButton';
import Input from '@mui/material/Input';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import React, { FunctionComponent, useState } from 'react';
import KeyIcon from '@mui/icons-material/Key';

interface PasswordInputProps {
    isTouched: boolean | undefined;
    id?: string;
    displayName: string;
    errors: string | undefined;
    handleChange: (e: React.ChangeEvent<any>) => void;
    handleBlur: (e: any) => void;
}

const PasswordInput: FunctionComponent<PasswordInputProps> = ({
    isTouched,
    id = 'password',
    displayName,
    errors,
    handleChange,
    handleBlur,
}: PasswordInputProps) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <FormControl
            sx={{ m: 1, width: '75%' }}
            variant='standard'
            error={(errors?.length ?? 0) > 0 && isTouched}
        >
            <InputLabel htmlFor={id}>
                {(errors?.length ?? 0) > 0 && isTouched
                    ? 'Error *'
                    : `${displayName} *`}
            </InputLabel>
            <Input
                id={id}
                required
                type={showPassword ? 'text' : 'password'}
                onChange={(e) => handleChange(e)}
                onBlur={(e) => handleBlur(e)}
                startAdornment={
                    <InputAdornment position='start'>
                        <KeyIcon />
                    </InputAdornment>
                }
                endAdornment={
                    <InputAdornment position='end'>
                        <IconButton
                            onClick={() => setShowPassword(true)}
                            onMouseDown={() => setShowPassword(false)}
                        >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                    </InputAdornment>
                }
            />
            <FormHelperText>{isTouched ? errors : ''}</FormHelperText>
        </FormControl>
    );
};

export default PasswordInput;
