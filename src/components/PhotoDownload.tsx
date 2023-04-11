import { PhotoCamera } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import { FunctionComponent } from 'react';
import { UseFormRegisterReturn } from 'react-hook-form';
import { WorkMode } from '../types/common/WorkMode';

interface PhotoDownloadProps {
    workMode: WorkMode;
    register: UseFormRegisterReturn<string>;
    photo: string;
}

const PhotoDownload: FunctionComponent<PhotoDownloadProps> = ({
    workMode,
    register,
    photo,
}: PhotoDownloadProps) => {
    const onSubmitFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        const reader = new FileReader();
        if (file) {
            const blob = new Blob([file], {
                type: file.type,
            });
            reader.readAsDataURL(blob);
            reader.onload = () => {
                const imageDataUrl = reader.result as string;
                register.onChange({
                    target: {
                        value: imageDataUrl,
                        name: register.name,
                    },
                    type: 'blur',
                });
            };
        }
    };
    return (
        <div style={{ display: 'flex', flexDirection: 'row' }}>
            <img width='100' alt='1' src={photo} />

            {workMode === 'edit' && (
                <IconButton
                    color='primary'
                    aria-label='upload picture'
                    component='label'
                >
                    <input
                        hidden
                        accept='image/*'
                        type='file'
                        onChange={onSubmitFile}
                    />
                    <PhotoCamera />
                </IconButton>
            )}
        </div>
    );
};

export default PhotoDownload;
