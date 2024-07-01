import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './MediaList.scss';

const MediaList = () => {
    const [mediaList, setMediaList] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [currentMedia, setCurrentMedia] = useState(null);
    const [newFileName, setNewFileName] = useState('');

    const fetchMedia = useCallback(async () => {
        try {
            const response = await axios.get(`${process.env.PUBLIC_URL}/media/mediaList.json`);
            console.log('Media List:', response.data);
            setMediaList(response.data);
        } catch (error) {
            console.error('Error fetching media:', error);
        }
    }, []);

    useEffect(() => {
        fetchMedia();
    }, [fetchMedia]);

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const handleUpload = async () => {
        if (!selectedFile) return;

        const formData = new FormData();
        formData.append('file', selectedFile);

        const token = localStorage.getItem('token');

        try {
            await axios.post('/api/v1/media/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                }
            });
            console.log('Uploaded Media');
            fetchMedia(); // Fetch media again after upload
            setSelectedFile(null);
        } catch (error) {
            console.error('Error uploading file:', error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`/api/v1/media/${id}`);
            fetchMedia(); // Fetch media again after delete
        } catch (error) {
            console.error('Error deleting media:', error);
        }
    };

    const handleEdit = (media) => {
        setCurrentMedia(media);
        setNewFileName(media.fileName);
        setShowEditModal(true);
    };

    const handleSave = async () => {
        try {
            await axios.put(`/api/v1/media/${currentMedia.id}`, { ...currentMedia, fileName: newFileName });
            fetchMedia(); // Fetch media again after save
            setShowEditModal(false);
        } catch (error) {
            console.error('Error updating media:', error);
        }
    };

    return (
        <div className="media-list">
            <div className="media-header">
                <h1>Media List</h1>
                <input type="file" onChange={handleFileChange} />
                <button onClick={handleUpload}>Upload</button>
                <button onClick={fetchMedia}>Reload</button>
            </div>
            <table className="media-table">
                <thead>
                    <tr>
                        <th>Thumbnail</th>
                        <th>File Name</th>
                        <th>Upload Date</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {mediaList.map((media) => (
                        <tr key={media.id}>
                            <td>
                                <img 
                                    src={`${process.env.PUBLIC_URL}${media.filePath}`} 
                                    alt={media.fileName} 
                                    width="50" 
                                    height="50" 
                                    onError={(e) => e.target.src = `${process.env.PUBLIC_URL}/default-thumbnail.png`} // default image if error
                                />
                            </td>
                            <td>{media.fileName}</td>
                            <td>{new Date(media.createdAt).toLocaleDateString()}</td>
                            <td>
                                <button onClick={() => handleEdit(media)}>Edit</button>
                                <button onClick={() => handleDelete(media.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {showEditModal && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>Edit Media</h2>
                        <input
                            type="text"
                            value={newFileName}
                            onChange={(e) => setNewFileName(e.target.value)}
                        />
                        <button onClick={handleSave}>Save</button>
                        <button onClick={() => setShowEditModal(false)}>Cancel</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MediaList;
