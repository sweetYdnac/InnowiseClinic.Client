import { Textarea } from '@mui/joy';
import { FunctionComponent } from 'react';

interface ReadonlyTextAreaProps {
    displayName: string;
    value: string;
}

const ReadonlyTextArea: FunctionComponent<ReadonlyTextAreaProps> = ({ displayName, value }) => {
    return <Textarea sx={{ m: 1, width: '75%' }} readOnly startDecorator={displayName} value={value} />;
};

export default ReadonlyTextArea;
