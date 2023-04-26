import { FunctionComponent } from 'react';
import { useParams } from 'react-router-dom';

interface AppointmentResultProps {}

const AppointmentResult: FunctionComponent<AppointmentResultProps> = () => {
    const { id } = useParams();

    return <></>;
};

export default AppointmentResult;
