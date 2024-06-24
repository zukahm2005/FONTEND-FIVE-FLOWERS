import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const ProductDetail = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);

    useEffect(() => {
        axios.get(`http://localhost:8080/api/v1/products/get/${id}`)
            .then(response => {
                setProduct(response.data);
            })
            .catch(error => {
                console.error(error);
            });
    }, [id]);

    if (!product) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>{product.name}</h1>
            <p>{product.description}</p>
            <p>Price: {product.price}</p>
            <p>Quantity: {product.quantity}</p>
            <p>Color: {product.color}</p>
            <p>Brand: {product.brand.name}</p>
            <p>Category: {product.category.name}</p>
            <h2>Images</h2>
            <div>
                {product.productImages && product.productImages.length > 0 ? (
                    product.productImages.map(image => (
                        <img 
                            key={image.productImageId} 
                            src={`http://localhost:8080/api/v1/images/${image.imageUrl}`} 
                            alt={product.name} 
                            style={{ width: '100px', height: '100px' }} 
                        />
                    ))
                ) : (
                    <p>No Images Available</p>
                )}
            </div>
        </div>
    );
};

export default ProductDetail;
