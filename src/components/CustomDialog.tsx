import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { FunctionComponent } from 'react';
import { EventType } from '../events/eventTypes';
import { eventEmitter } from '../events/events';

interface CustomDialogProps {
    isOpen: boolean;
    name: string;
    title: string;
    content: string;
    submitText?: string;
    declineText?: string;
}

const CustomDialog: FunctionComponent<CustomDialogProps> = ({
    isOpen,
    name,
    title,
    content,
    submitText = 'Yes',
    declineText = 'No',
}: CustomDialogProps) => {
    const handleDecline = () => {
        eventEmitter.emit(`${EventType.DECLINE_DIALOG} ${name}`);
    };

    const handleSubmit = () => {
        eventEmitter.emit(`${EventType.SUBMIT_DIALOG} ${name}`);
    };

    return (
        <Dialog open={isOpen} onClose={handleDecline}>
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>
                <DialogContentText>{content}</DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleDecline}>{declineText}</Button>
                <Button onClick={handleSubmit} autoFocus>
                    {submitText}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default CustomDialog;
