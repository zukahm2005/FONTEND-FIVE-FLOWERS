import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { FaCalendarAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import './blogNewHome.scss';

const BlogNew = () => {
    const [blogs, setBlogs] = useState([]);

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/v1/blogs/all');
                console.log('Response data:', response.data.content); // Kiểm tra dữ liệu từ API
                setBlogs(response.data.content);
            } catch (error) {
                console.error('Error fetching blogs:', error);
            }
        };

        fetchBlogs();
    }, []);

    const formatDate = (dateArray) => {
        if (Array.isArray(dateArray)) {
            const [year, month, day] = dateArray;
            return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        }
        return 'Invalid Date';
    };

    const extractFirstImageUrl = (htmlContent) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlContent, 'text/html');
        const img = doc.querySelector('img');
        return img ? img.src : null;
    };

    return (
        <div className='blog-new-container'>
            <h2>Our Latest News</h2>
            <div className='blog-list'>
                {blogs.slice(0, 3).map(blog => (  // Chỉ lấy 3 bài blog đầu tiên
                    <div key={blog.blogId} className='blog-item'>
                        <img src={blog.imageUrl || extractFirstImageUrl(blog.content)} alt={blog.title} className='blog-image-home' onError={(e) => { e.target.src = '/fallback-image.jpg'; }} />
                        <div className='blog-meta'>
                            <span className='blog-date'>
                                <FaCalendarAlt /> {formatDate(blog.createdAt)}
                            </span>
                        </div>
                        <h3>{blog.title}</h3>
                        <p>{blog.content.substring(0, 100)}...</p>
                        <Link to={`/news/${blog.blogId}`} className="read-more-btn">READ MORE</Link>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BlogNew;
