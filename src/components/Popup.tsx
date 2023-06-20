import Alert, { AlertColor } from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import React, { FunctionComponent, useEffect, useState } from 'react';
import { EventType } from '../events/eventTypes';
import { eventEmitter } from '../events/events';

export interface PopupData {
    color?: AlertColor;
    message: string;
}

const Popup: FunctionComponent = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [data, setData] = useState<PopupData>({
        color: 'error',
        message: 'Something went wrong',
    });

    const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }

        setIsOpen(false);
    };

    const handleSnackbar = (duration: number) => {
        setIsOpen(true);
        setTimeout(() => {
            setIsOpen(false);
        }, duration);
    };

    useEffect(() => {
        const showPopup = (style: PopupData) => {
            setData({
                color: style.color ?? data.color,
                message: style.message,
            });

            handleSnackbar(6000);
        };

        eventEmitter.addListener(`${EventType.SHOW_POPUP}`, showPopup);

        return () => {
            eventEmitter.removeListener(`${EventType.SHOW_POPUP}`, showPopup);
        };
    }, [data, setData]);

    return (
        <Snackbar open={isOpen} onClose={handleClose}>
            <Alert onClose={handleClose} severity={data.color} sx={{ width: '100%' }} className='alert'>
                {data.message}
            </Alert>
        </Snackbar>
    );
};

export default Popup;
