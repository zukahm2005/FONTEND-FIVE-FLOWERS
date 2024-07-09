import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './GetAllCategoryAdmin.scss';

const GetAllCategory = () => {
    const [categories, setCategories] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get('http://localhost:8080/api/v1/categories/all', {
            params: {
                page: 0,
                size: 10,
                sortBy: 'categoryId'
            }
        })
        .then(response => {
            console.log(response.data.content); 
            setCategories(response.data.content); 
        })
        .catch(error => {
            console.error('There was an error fetching the categories!', error);
        });
    }, []);

    const handleCreateCategory = () => {
        navigate('add');
    };

    return (
        <div className="get-all-category">
            <h2>Category</h2>
            <div className="collections-header">
                <button className="create-collection-button" onClick={handleCreateCategory}>Create Category</button>
            </div>
            <table className="collections-table">
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>Name</th>
                        <th>Description</th>
                    </tr>
                </thead>
                <tbody>
                    {categories.map((category) => (
                        <tr key={category.categoryId}>
                            <td>{category.categoryId}</td>
                            <td>{category.name}</td>
                            <td>{category.description}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default GetAllCategory;
