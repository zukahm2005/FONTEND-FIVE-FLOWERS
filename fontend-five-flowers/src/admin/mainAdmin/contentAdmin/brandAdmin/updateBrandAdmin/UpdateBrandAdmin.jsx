import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate, useParams } from 'react-router-dom';
import CKEditorComponent from "../../CKEditorComponent/CKEditorComponent";
import './UpdateBrandAdmin.scss';

const UpdateBrandAdmin = () => {
    const { brandId } = useParams(); // Assuming you are using React Router to get the brandId from URL params
    const navigate = useNavigate();
    const [brand, setBrand] = useState({
        name: '',
        description: ''
    });

    const [message, setMessage] = useState('');
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (brandId) {
            fetchBrandDetails(brandId);
        }
    }, [brandId]);

    const fetchBrandDetails = (id) => {
        axios.get(`http://localhost:8080/api/v1/brands/get/${id}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
        .then(response => {
            const { name, description } = response.data;
            setBrand({ name, description });
        })
        .catch(error => {
            console.error('Error fetching brand details:', error);
            setMessage('Failed to fetch brand details. Please try again.');
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setBrand((prevState) => ({
            ...prevState,
            [name]: value,
        }));
        setErrors((prevState) => ({
            ...prevState,
            [name]: "",
        }));
    };

    const handleDescriptionChange = (event, editor, data) => {
        const description = editor.getData(); // Get the updated data from the editor
        setBrand((prevState) => ({
            ...prevState,
            description: description,
        }));
        setErrors((prevState) => ({
            ...prevState,
            description: "",
        }));
    };

    const validateForm = () => {
        let newErrors = {};
        if (!brand.name) newErrors.name = "Name is required";
        if (!brand.description) newErrors.description = "Description is required";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        const brandData = {
            name: brand.name,
            description: brand.description // Ensure the updated description is included here
        };

        axios.put(`http://localhost:8080/api/v1/brands/update/${brandId}`, brandData, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
        .then(response => {
            setMessage('Brand updated successfully!');
            setBrand({ name: '', description: '' });
            navigate(-1);
        })
        .catch(error => {
            console.error(error);
            setMessage('Failed to update brand. Please try again.');
        });
    };

    return (
        <div className="update-brand-admin">
            <div className="title-brand-container" onClick={() => navigate(-1)}>
                <div className="arrow-back-brand">
                    <p>
                        <FaArrowLeft />
                    </p>
                </div>
                <div className="title-update-brand">
                    <p>Update Brand</p>
                </div>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Name:</label>
                    <input
                        type="text"
                        name="name"
                        value={brand.name}
                        onChange={handleInputChange}
                        placeholder="e.g. Apple, Samsung"
                    />
                    {errors.name && <p className="error">{errors.name}</p>}
                </div>
                <div className="form-group">
                    <label>Description:</label>
                    <CKEditorComponent
                        data={brand.description}
                        onChange={handleDescriptionChange}
                    />
                    {errors.description && <p className="error">{errors.description}</p>}
                </div>
                <div
                    className="submit-button"
                    onClick={handleSubmit}
                    role="button"
                    tabIndex="0"
                    onKeyPress={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                            handleSubmit(e);
                        }
                    }}
                >
                    <p>Update Brand</p>
                </div>
            </form>
            {message && <p className="message">{message}</p>}
        </div>
    );
};

export default UpdateBrandAdmin;
