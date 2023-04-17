import CloseIcon from '@mui/icons-material/Close';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Modal from '@mui/material/Modal';
import { FunctionComponent } from 'react';
import { EventType } from '../../events/eventTypes';
import { eventEmitter } from '../../events/events';
import '../customizedModal/CustomizedModal.css';

interface CustomizedModalProps {
    isOpen: boolean;
    name: string;
    children: React.ReactNode;
}

const CustomizedModal: FunctionComponent<CustomizedModalProps> = ({ isOpen, name, children }: CustomizedModalProps) => {
    const closeModal = () => {
        eventEmitter.emit(`${EventType.CLICK_CLOSE_MODAL} ${name}`);
    };

    return (
        <>
            <Modal open={isOpen}>
                <Box className='modal-box' component='div'>
                    <IconButton onClick={closeModal} sx={{ alignSelf: 'end' }}>
                        <CloseIcon fontSize='medium' />
                    </IconButton>
                    {children}
                </Box>
            </Modal>
        </>
    );
};

export default CustomizedModal;
