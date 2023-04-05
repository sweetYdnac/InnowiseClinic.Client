import { FunctionComponent } from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert, { AlertColor } from '@mui/material/Alert';
import React from 'react';

interface PopupProps {
    style?: React.CSSProperties;
    color: AlertColor;
    message: string;
    open: boolean;
    onHandleClose: () => void;
}

const Popup: FunctionComponent<PopupProps> = ({
    style,
    color,
    message,
    open,
    onHandleClose,
}) => {
    const handleClose = (
        event?: React.SyntheticEvent | Event,
        reason?: string
    ) => {
        if (reason === 'clickaway') {
            return;
        }

        onHandleClose();
    };

    return (
        <Snackbar
            style={style}
            open={open}
            autoHideDuration={6000}
            onClose={handleClose}
        >
            <Alert
                onClose={handleClose}
                severity={color}
                sx={{ width: '100%' }}
                className='alert'
            >
                {message}
            </Alert>
        </Snackbar>
    );
};

export default Popup;
