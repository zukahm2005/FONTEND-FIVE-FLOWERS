import React, { useState } from 'react';
import axios from 'axios';

const UploadButton = ({ onUpload }) => {
    const [selectedFile, setSelectedFile] = useState(null);

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const handleUpload = async () => {
        if (!selectedFile) return;

        const formData = new FormData();
        formData.append('file', selectedFile);

        const token = localStorage.getItem('token'); // Giả sử token được lưu trong localStorage

        if (!token) {
            console.error('No token found');
            return;
        }

        try {
            const response = await axios.post('/api/v1/media/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                }
            });
            console.log('File uploaded successfully:', response.data);
            if (onUpload) {
                onUpload(response.data); // Call the callback function after successful upload
            }
        } catch (error) {
            console.error('Error uploading file:', error);
        }
    };

    return (
        <div>
            <input type="file" onChange={handleFileChange} />
            <button onClick={handleUpload}>Upload</button>
        </div>
    );
};

export default UploadButton;
