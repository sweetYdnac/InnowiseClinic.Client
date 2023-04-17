import { AccountCircle } from '@mui/icons-material';
import FormControl from '@mui/material/FormControl';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import { FunctionComponent } from 'react';
import { UseFormRegisterReturn } from 'react-hook-form';

interface EmailAddressInputProps {
    displayName: string;
    isTouched: boolean | undefined;
    errors: string | undefined;
    register: UseFormRegisterReturn<string>;
}

const EmailAddressInput: FunctionComponent<EmailAddressInputProps> = ({
    displayName,
    isTouched,
    errors,
    register,
}: EmailAddressInputProps) => {
    return (
        <FormControl sx={{ m: 1, width: '75%' }} variant='standard' error={(errors?.length ?? 0) > 0 && isTouched}>
            <TextField
                {...register}
                required
                label={(errors?.length ?? 0) > 0 && isTouched ? 'Error' : displayName}
                placeholder='example@gmail.com'
                variant='standard'
                error={(errors?.length ?? 0) > 0 && isTouched}
                helperText={isTouched ? errors : ''}
                InputProps={{
                    inputMode: 'email',
                    startAdornment: (
                        <InputAdornment position='start'>
                            <AccountCircle />
                        </InputAdornment>
                    ),
                }}
                InputLabelProps={{
                    shrink: true,
                }}
            />
        </FormControl>
    );
};

export default EmailAddressInput;
