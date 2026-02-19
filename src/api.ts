import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || ''; // Relative path for Vercel, or env var

export const api = axios.create({
    baseURL: API_URL,
});

export const uploadFile = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post('/upload', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

export const getClusters = async () => {
    const response = await api.get('/clusters');
    return response.data;
};

export const getInsights = async () => {
    const response = await api.get('/insights');
    return response.data;
};

export const downloadResults = async () => {
    const response = await api.get('/download', {
        responseType: 'blob',
    });
    // Create a link to download
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'segmented_customers.csv');
    document.body.appendChild(link);
    link.click();
    link.remove();
};
