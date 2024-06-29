import React from 'react';
import './EditMediaPopup.scss';

const EditMediaPopup = ({ show, media, newFileName, onClose, onSave, onFileNameChange }) => {
    if (!show) return null;

    return (
        <div className="popup">
            <div className="popup-inner">
                <h2>Edit Media</h2>
                <input
                    type="text"
                    value={newFileName}
                    onChange={onFileNameChange}
                />
                <button onClick={onSave}>Save Changes</button>
                <button onClick={onClose}>Close</button>
            </div>
        </div>
    );
};

export default EditMediaPopup;
