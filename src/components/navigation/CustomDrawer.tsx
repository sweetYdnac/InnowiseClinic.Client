import { Drawer, DrawerProps } from '@mui/material';
import { FunctionComponent, ReactNode, useCallback, useEffect, useState } from 'react';
import { EventType } from '../../events/eventTypes';
import { eventEmitter } from '../../events/events';

interface AsideProps {
    children: ReactNode;
    variant: DrawerProps['variant'];
    sx: DrawerProps['sx'];
}

const CustomDrawer: FunctionComponent<AsideProps> = ({ children, variant, sx }: AsideProps) => {
    const [open, setOpen] = useState(false);

    const handleDrawerToggle = useCallback(() => {
        setOpen(!open);
    }, [open]);

    useEffect(() => {
        eventEmitter.addListener(EventType.SWITCH_ASIDE, handleDrawerToggle);

        return () => {
            eventEmitter.removeListener(EventType.SWITCH_ASIDE, handleDrawerToggle);
        };
    }, [handleDrawerToggle]);

    return (
        <Drawer
            variant={variant}
            open={open}
            onClose={handleDrawerToggle}
            ModalProps={{
                keepMounted: true,
            }}
            sx={sx}
        >
            {children}
        </Drawer>
    );
};

export default CustomDrawer;
