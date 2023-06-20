import { ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { FunctionComponent, ReactNode } from 'react';
import { EventType } from '../../events/eventTypes';
import { eventEmitter } from '../../events/events';

interface AsideItemProps {
    displayName: string;
    children: ReactNode;
    handleClick: React.MouseEventHandler<HTMLLIElement>;
}

const AsideItem: FunctionComponent<AsideItemProps> = ({ displayName, children, handleClick }: AsideItemProps) => {
    const handleOnClick = (e: React.MouseEvent<HTMLLIElement>) => {
        handleClick(e);
        eventEmitter.emit(EventType.SWITCH_ASIDE);
    };

    return (
        <ListItem disablePadding onClick={handleOnClick}>
            <ListItemButton style={{ margin: '10px 0px' }}>
                <ListItemIcon>{children}</ListItemIcon>
                <ListItemText primary={displayName} />
            </ListItemButton>
        </ListItem>
    );
};

export default AsideItem;
