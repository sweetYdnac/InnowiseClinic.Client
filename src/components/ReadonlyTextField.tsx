import { InputAdornment, TextField } from '@mui/material';
import { FunctionComponent, ReactNode } from 'react';

interface ReadonlyTextFieldProps {
    displayName: string;
    value: string | number;
    inputMode?: 'text' | 'numeric';
    startAdornment?: ReactNode;
    endAdornment?: ReactNode;
}

const ReadonlyTextField: FunctionComponent<ReadonlyTextFieldProps> = ({
    displayName,
    value,
    inputMode = 'text',
    startAdornment,
    endAdornment,
}) => {
    return (
        <TextField
            sx={{ m: 1, width: '75%' }}
            value={value}
            label={displayName}
            variant='standard'
            InputProps={{
                readOnly: true,
                inputMode: inputMode,
                startAdornment: <InputAdornment position='start'>{startAdornment}</InputAdornment>,
                endAdornment: <InputAdornment position='start'>{endAdornment}</InputAdornment>,
            }}
        />
    );
};

export default ReadonlyTextField;
