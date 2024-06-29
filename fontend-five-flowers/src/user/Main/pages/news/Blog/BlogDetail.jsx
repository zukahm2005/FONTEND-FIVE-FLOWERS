import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './BlogDetail.scss';

const BlogDetail = () => {
    const { blogId } = useParams();
    const [blog, setBlog] = useState(null);

    useEffect(() => {
        const fetchBlog = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/v1/blogs/get/${blogId}`);
                setBlog(response.data);
            } catch (error) {
                console.error(error);
                alert('Failed to fetch blog details. Please try again.');
            }
        };

        fetchBlog();
    }, [blogId]);

    if (!blog) {
        return <div>Loading...</div>;
    }

    return (
        <div className='blog-detail'>
            <h1>{blog.title}</h1>
            <img src={`http://localhost:8080/api/v1/images/${blog.imageUrl}`} alt={blog.title} />
            <p>{blog.content}</p>
        </div>
    );
};

export default BlogDetail;
