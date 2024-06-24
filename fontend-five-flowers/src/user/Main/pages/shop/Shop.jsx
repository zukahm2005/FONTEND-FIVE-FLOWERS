import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Shop = () => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:8080/api/v1/products/all')
            .then(response => {
                setProducts(response.data.content);
            })
            .catch(error => {
                console.error(error);
            });
    }, []);

    return (
        <div>
            <h1>Danh sách sản phẩm</h1>
            <ul>
                {products.map(product => (
                    <li key={product.productId}>
                        <Link to={`/product/${product.productId}`}>
                            {product.productImages && product.productImages.length > 0 ? (
                                <img 
                                    src={`http://localhost:8080/api/v1/images/${product.productImages[0].imageUrl}`} 
                                    alt={product.name} 
                                    style={{ width: '100px', height: '100px' }}
                                />
                            ) : (
                                <p>No Image</p>
                            )}
                            <p>{product.name}</p>
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Shop;
