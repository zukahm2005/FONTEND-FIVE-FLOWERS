import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './ProductAdmin.scss'; // Import file SCSS

const ProductAdmin = () => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/v1/products/all', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                setProducts(response.data.content || []);
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };

        fetchProducts();
    }, []);

    return (
        <div className="admin-product-list-container">
            <h1>Products</h1>
            <Link to="/admin/addproducadmin">Add New Product</Link>
            <table>
                <thead>
                    <tr>
                        <th>Image</th>
                        <th>Name</th>
                        <th>Quantity</th>
                        <th>Created At</th>
                        <th>Updated At</th>
                    </tr>
                </thead>
                <tbody>
                    {(products || []).map((product) => (
                        <tr key={product.productId}>
                            <td>
                                <img
                                    src={(product.media && product.media.length > 0) ? product.media[0].filePath : '/default-image.png'}
                                    alt={product.name}
                                    className="product-image"
                                />
                            </td>
                            <td>{product.name}</td>
                            <td>{product.quantity}</td>
                            <td>{new Date(product.createdAt).toLocaleString()}</td>
                            <td>{new Date(product.updatedAt).toLocaleString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ProductAdmin;
