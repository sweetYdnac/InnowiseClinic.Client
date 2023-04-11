import { Backdrop, CircularProgress } from '@mui/material';
import { FunctionComponent } from 'react';

interface LoaderProps {
    isOpen: boolean;
}

const Loader: FunctionComponent<LoaderProps> = ({ isOpen }: LoaderProps) => {
    return (
        <Backdrop
            sx={{
                color: '#fff',
                zIndex: (theme) => theme.zIndex.drawer + 1,
            }}
            open={isOpen}
        >
            <CircularProgress color='inherit' />
        </Backdrop>
    );
};

export default Loader;
