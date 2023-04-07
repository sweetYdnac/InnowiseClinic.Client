import Button from '@mui/material/Button';
import { FunctionComponent, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthorizationService from '../../services/AuthorizationService';

interface CreatePatientProps {}

const CreatePatient: FunctionComponent<CreatePatientProps> = () => {
    const navigate = useNavigate();

    useEffect(() => {
        if (!AuthorizationService.isAuthorized()) {
            navigate('/', { replace: true });
        }
    });

    return (
        <>
            <h1>Create Patient</h1>
            <Button variant='contained' component='label'>
                Upload
                <input hidden accept='image/*' multiple type='file' />
            </Button>
        </>
    );
};

export default CreatePatient;
