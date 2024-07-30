import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate, useParams } from 'react-router-dom';
import CKEditorComponent from "../../CKEditorComponent/CKEditorComponent";
import './UpdateCategoryAdmin.scss';

const UpdateCategoryAdmin = () => {
    const { categoryId } = useParams(); // Assuming you are using React Router to get the categoryId from URL params
    const navigate = useNavigate();
    const [category, setCategory] = useState({
        name: '',
        description: ''
    });

    const [message, setMessage] = useState('');
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (categoryId) {
            fetchCategoryDetails(categoryId);
        }
    }, [categoryId]);

    const fetchCategoryDetails = (id) => {
        axios.get(`http://localhost:8080/api/v1/categories/get/${id}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
        .then(response => {
            const { name, description } = response.data;
            setCategory({ name, description });
        })
        .catch(error => {
            console.error('Error fetching category details:', error);
            setMessage('Failed to fetch category details. Please try again.');
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCategory((prevState) => ({
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
        setCategory((prevState) => ({
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
        if (!category.name) newErrors.name = "Name is required";
        if (!category.description) newErrors.description = "Description is required";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        const categoryData = {
            name: category.name,
            description: category.description // Ensure the updated description is included here
        };

        axios.put(`http://localhost:8080/api/v1/categories/update/${categoryId}`, categoryData, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
        .then(response => {
            setMessage('Category updated successfully!');
            setCategory({ name: '', description: '' });
            navigate(-1);
        })
        .catch(error => {
            console.error(error);
            setMessage('Failed to update category. Please try again.');
        });
    };

    return (
        <div className="update-category-admin">
            <div className="title-category-container" onClick={() => navigate(-1)}>
                <div className="arrow-back-category">
                    <p>
                        <FaArrowLeft />
                    </p>
                </div>
                <div className="title-update-category">
                    <p>Update Category</p>
                </div>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Name:</label>
                    <input
                        type="text"
                        name="name"
                        value={category.name}
                        onChange={handleInputChange}
                        placeholder="e.g. Summer collection, Under $100, Staff picks"
                    />
                    {errors.name && <p className="error">{errors.name}</p>}
                </div>
                <div className="form-group">
                    <label>Description:</label>
                    <CKEditorComponent
                        data={category.description}
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
                    <p>Update Category</p>
                </div>
            </form>
            {message && <p className="message">{message}</p>}
        </div>
    );
};

export default UpdateCategoryAdmin;
