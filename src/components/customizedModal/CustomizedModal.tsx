import Box from '@mui/material/Box';
import { FunctionComponent } from 'react';
import Modal from '@mui/material/Modal';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import '../customizedModal/CustomizedModal.css';

interface CustomizedModalProps {
    isOpen: boolean;
    setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    children: React.ReactNode;
}

const CustomizedModal: FunctionComponent<CustomizedModalProps> = ({
    isOpen,
    setModalOpen,
    children,
}: CustomizedModalProps) => {
    return (
        <>
            <Modal open={isOpen}>
                <Box className='modal-box' component='div'>
                    <IconButton
                        onClick={() => setModalOpen(false)}
                        sx={{ alignSelf: 'end' }}
                    >
                        <CloseIcon fontSize='medium' />
                    </IconButton>
                    {children}
                </Box>
            </Modal>
        </>
    );
};

export default CustomizedModal;
