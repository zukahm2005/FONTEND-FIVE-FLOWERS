import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AddProduct = () => {
    const [brands, setBrands] = useState([]);
    const [categories, setCategories] = useState([]);
    const [product, setProduct] = useState({
        name: '',
        description: '',
        price: 0,
        quantity: 0,
        color: '',
        brandId: '',
        categoryId: ''
    });
    const [images, setImages] = useState([]);
    const [message, setMessage] = useState('');

    useEffect(() => {
        axios.get('http://localhost:8080/api/v1/brands/all', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
        .then(response => setBrands(response.data.content))
        .catch(error => console.error('Error fetching brands:', error));

        axios.get('http://localhost:8080/api/v1/categories/all', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
        .then(response => setCategories(response.data.content))
        .catch(error => console.error('Error fetching categories:', error));
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProduct({ ...product, [name]: value });
    };

    const handleFileChange = (e) => {
        setImages(e.target.files);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // First, add the product
            const productResponse = await axios.post('http://localhost:8080/api/v1/products/add', product, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                }
            });

            const productId = productResponse.data.productId;

            // If product is added successfully, add images
            if (productId && images.length > 0) {
                const formData = new FormData();
                for (let i = 0; i < images.length; i++) {
                    formData.append('files', images[i]);
                }

                await axios.post(`http://localhost:8080/api/v1/products/add/images/${productId}`, formData, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'multipart/form-data'
                    }
                });

                setMessage('Product and images added successfully');
            } else {
                setMessage('Product added but no images to upload');
            }
        } catch (error) {
            console.error(error);
            setMessage('Failed to add product. Please try again.');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="text" name="name" placeholder="Product Name" value={product.name} onChange={handleInputChange} required />
            <textarea name="description" placeholder="Description" value={product.description} onChange={handleInputChange} required />
            <input type="number" name="price" placeholder="Price" value={product.price} onChange={handleInputChange} required />
            <input type="number" name="quantity" placeholder="Quantity" value={product.quantity} onChange={handleInputChange} required />
            <input type="text" name="color" placeholder="Color" value={product.color} onChange={handleInputChange} required />

            <select name="brandId" value={product.brandId} onChange={handleInputChange} required>
                <option value="">Select Brand</option>
                {brands.map((brand) => (
                    <option key={brand.brandId} value={brand.brandId}>{brand.name}</option>
                ))}
            </select>

            <select name="categoryId" value={product.categoryId} onChange={handleInputChange} required>
                <option value="">Select Category</option>
                {categories.map((category) => (
                    <option key={category.categoryId} value={category.categoryId}>{category.name}</option>
                ))}
            </select>

            <input type="file" multiple onChange={handleFileChange} />

            <button type="submit">Add Product</button>
            {message && <p>{message}</p>}
        </form>
    );
};

export default AddProduct;
