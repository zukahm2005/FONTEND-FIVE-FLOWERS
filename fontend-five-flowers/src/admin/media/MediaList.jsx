import React, { useState, useEffect } from 'react';
import axios from 'axios';
import EditMediaPopup from './EditMediaPopup';
import UploadButton from './UploadButton';
import './MediaList.scss';

const MediaList = () => {
    const [mediaList, setMediaList] = useState([]);
    const [page, setPage] = useState(0);
    const [size] = useState(10); // Page size
    const [totalPages, setTotalPages] = useState(1);
    const [show, setShow] = useState(false);
    const [currentMedia, setCurrentMedia] = useState(null);
    const [newFileName, setNewFileName] = useState('');

    useEffect(() => {
        fetchMedia(page, size);
    }, [page, size]);

    const fetchMedia = async (page, size) => {
        try {
            const response = await axios.get(`/api/v1/media/paged?page=${page}&size=${size}`);
            setMediaList(response.data.content);
            setTotalPages(response.data.totalPages);
        } catch (error) {
            console.error('Error fetching media:', error);
        }
    };

    const handlePageChange = (newPage) => {
        setPage(newPage);
    };

    const handleShow = (media) => {
        setCurrentMedia(media);
        setNewFileName(media.fileName);
        setShow(true);
    };

    const handleClose = () => setShow(false);

    const handleSave = async () => {
        try {
            await axios.put(`/api/v1/media/${currentMedia.id}`, { ...currentMedia, fileName: newFileName });
            fetchMedia(page, size); // Refresh the media list
            handleClose();
        } catch (error) {
            console.error('Error updating media:', error);
        }
    };

    return (
        <div className="media-list">
            <div className="media-header">
                <h1>Media List</h1>
                <UploadButton />
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
                                <img src={media.filePath} alt={media.fileName} width="50" height="50" onClick={() => handleShow(media)} />
                            </td>
                            <td>{media.fileName}</td>
                            <td>{new Date(media.createdAt).toLocaleDateString()}</td>
                            <td>
                                <button onClick={() => handleShow(media)}>Edit</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="pagination">
                {[...Array(totalPages).keys()].map(number => (
                    <button key={number} onClick={() => handlePageChange(number)} disabled={number === page}>
                        {number + 1}
                    </button>
                ))}
            </div>

            <EditMediaPopup
                show={show}
                media={currentMedia}
                newFileName={newFileName}
                onClose={handleClose}
                onSave={handleSave}
                onFileNameChange={(e) => setNewFileName(e.target.value)}
            />
        </div>
    );
};

export default MediaList;
