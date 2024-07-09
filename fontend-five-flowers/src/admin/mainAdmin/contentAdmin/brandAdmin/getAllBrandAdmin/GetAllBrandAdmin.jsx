import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './GetAllBrandAdmin.scss';

const GetAllBrandAdmin = () => {
    const [brands, setBrands] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get('http://localhost:8080/api/v1/brands/all', {
            params: {
                page: 0,
                size: 10,
                sortBy: 'brandId'
            }
        })
        .then(response => {
            setBrands(response.data.content); // Assuming `content` contains the list of brands
        })
        .catch(error => {
            console.error('There was an error fetching the brands!', error);
        });
    }, []);

    const handleCreateBrand = () => {
        navigate('add');
    };

    return (
        <div className="get-all-brand">
            <h2>Brand</h2>
            <div className="brands-header">
                <button className="create-brand-button" onClick={handleCreateBrand}>Create Brand</button>
            </div>
            <table className="brands-table">
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>Name</th>
                        <th>Description</th>
                    </tr>
                </thead>
                <tbody>
                    {brands.map((brand) => (
                        <tr key={brand.brandId}>
                            <td>{brand.brandId}</td>
                            <td>{brand.name}</td>
                            <td>{brand.description}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default GetAllBrandAdmin;
