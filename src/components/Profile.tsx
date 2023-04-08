import Button from '@mui/material/Button';
import { FunctionComponent, useEffect, useMemo, useState } from 'react';
import PatientsService from '../services/PatientsService';
import AuthorizationService from '../services/AuthorizationService';
import IProfileResponse from '../types/profile/response/IProfileResponse';
import Box from '@mui/material/Box';
import CustomTextField from './CustomTextField';
import GetProfileValidator from '../validators/profiles/ProfileValidator';

export type WorkMode = 'view' | 'edit';

interface ProfileProps {
    workMode?: WorkMode;
}

const Profile: FunctionComponent<ProfileProps> = ({ workMode = 'view' }) => {
    const [mode, setWorkMode] = useState(workMode);
    const [profile, setProfile] = useState<IProfileResponse>();

    const validator = GetProfileValidator(profile as IProfileResponse);

    const switchWorkMode = () => {
        setWorkMode(mode === 'view' ? 'edit' : 'view');
        validator.setTouched({});
    };

    async function getProfile() {
        await PatientsService.getById(AuthorizationService.getAccountId()).then(
            (response) => {
                setProfile(response.data as IProfileResponse);
            }
        );
    }

    useEffect(() => {
        getProfile();
    }, []);

    return (
        <>
            <Button onClick={switchWorkMode}>{mode}</Button>
            <Box
                // onSubmit={validator.handleSubmit}
                component={mode === 'view' ? 'div' : 'form'}
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                }}
                noValidate
                autoComplete='off'
            >
                <CustomTextField
                    workMode={mode}
                    id='firstName'
                    displayName='First Name'
                    value={profile?.firstName}
                    isTouched={validator.touched.firstName}
                    errors={validator.errors.firstName}
                    handleChange={validator.handleChange}
                    handleBlur={validator.handleBlur}
                />

                <CustomTextField
                    workMode={mode}
                    id='lastName'
                    displayName='Last Name'
                    value={profile?.lastName}
                    isTouched={validator.touched.lastName}
                    errors={validator.errors.lastName}
                    handleChange={validator.handleChange}
                    handleBlur={validator.handleBlur}
                />

                <Button variant='contained' component='label'>
                    Upload
                    <input hidden accept='image/*' multiple type='file' />
                </Button>
            </Box>
        </>
    );
};

export default Profile;
