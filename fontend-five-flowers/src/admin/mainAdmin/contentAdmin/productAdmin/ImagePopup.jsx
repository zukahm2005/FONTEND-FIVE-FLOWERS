import React, { useEffect, useState } from 'react';
import axios from 'axios';
import UploadButton from './UploadButton';
import './ImagePopup.scss';

const ImagePopup = ({ onClose, onUpload }) => {
    const [images, setImages] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchImages = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/v1/media', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                if (Array.isArray(response.data)) {
                    setImages(response.data);
                } else if (response.data.content && Array.isArray(response.data.content)) {
                    setImages(response.data.content);
                } else {
                    setError('Unexpected response format');
                }
            } catch (error) {
                setError('Failed to fetch images');
            }
        };

        fetchImages();
    }, []);

    const handleUpload = (uploadedImages) => {
        setImages([...images, ...uploadedImages]);
        if (onUpload) {
            onUpload([...images, ...uploadedImages]);
        }
    };

    return (
        <div className="image-popup">
            <div className="image-popup-content">
                <button onClick={onClose}>Close</button>
                <UploadButton onUpload={handleUpload} />
                {error && <p className="error">{error}</p>}
                <div className="image-grid">
                    {(images || []).map((image) => (
                        <div key={image.id} className="image-item">
                            <img src={image.filePath} alt={image.fileName} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ImagePopup;
