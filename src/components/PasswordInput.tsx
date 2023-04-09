import { Visibility, VisibilityOff } from '@mui/icons-material';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import IconButton from '@mui/material/IconButton';
import Input from '@mui/material/Input';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import { FunctionComponent, useState } from 'react';
import KeyIcon from '@mui/icons-material/Key';
import { UseFormRegisterReturn } from 'react-hook-form';

interface PasswordInputProps {
    displayName: string;
    isTouched: boolean | undefined;
    errors: string | undefined;
    register: UseFormRegisterReturn<string>;
}

const PasswordInput: FunctionComponent<PasswordInputProps> = ({
    displayName,
    isTouched,
    errors,
    register,
}: PasswordInputProps) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <FormControl
            sx={{ m: 1, width: '75%' }}
            variant='standard'
            error={(errors?.length ?? 0) > 0 && isTouched}
            required
        >
            <InputLabel htmlFor={register.name}>
                {(errors?.length ?? 0) > 0 && isTouched ? 'Error' : displayName}
            </InputLabel>
            <Input
                {...register}
                id={register.name}
                type={showPassword ? 'text' : 'password'}
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
