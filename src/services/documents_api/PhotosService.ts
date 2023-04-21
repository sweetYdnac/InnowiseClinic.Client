import https from '../../utils/https-common';

const getById = async (id: string) => {
    let response = await https.get<Blob>(`/documents/photos/${id}`, {
        responseType: 'blob',
    });

    const reader = new FileReader();

    return new Promise<string>((resolve, reject) => {
        reader.onload = () => {
            const imageDataUrl = reader.result as string;
            resolve(imageDataUrl);
        };

        reader.onerror = (error) => {
            reject(error);
        };

        reader.readAsDataURL(response.data);
    });
};

const update = async (id: string, photo: string) => {
    const blob = await (await fetch(photo)).blob();
    const file = new File([blob], id, { type: blob.type });

    const formData = new FormData();
    formData.append('photo', file);

    await https.put(`/documents/photos/${id}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};

const PhotosService = {
    getById,
    update,
};

export default PhotosService;
