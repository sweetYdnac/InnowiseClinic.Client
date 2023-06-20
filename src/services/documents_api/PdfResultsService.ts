import https from '../../utils/https-common';

const getById = async (id: string) =>
    (
        await https.get<Blob>(`/documents/appointmentresults/${id}`, {
            responseType: 'blob',
        })
    ).data;

const PdfResultsService = {
    getById,
};

export default PdfResultsService;
