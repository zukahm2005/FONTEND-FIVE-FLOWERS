import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaCalendarAlt, FaComment } from 'react-icons/fa'; // Import các biểu tượng bạn cần
import './news.scss'; // Đường dẫn đến file SCSS của bạn

const News = () => {
    const [blogs, setBlogs] = useState([]);

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/v1/blogs/all');
                setBlogs(response.data.content);
            } catch (error) {
                console.error(error);
            }
        };

        fetchBlogs();
    }, []);

    return (
        <div className='news-container'>
            <div className="header-container">
                <div className="header-content">
                    <h1>NEWS</h1>
                    <div className="breadcrumb">
                        <a href="/">Home</a> / <span>News</span>
                    </div>
                </div>
            </div>
            <div className='blog-list-container'>
                {blogs.map((blog) => (
                    <div key={blog.blogId} className="blog-item">
                        <img src={`http://localhost:8080/api/v1/images/${blog.imageUrl}`} alt={blog.title} className="blog-image" />
                        <div className="blog-content">
                            <div className="blog-meta">
                                <span className="blog-date">
                                    <FaCalendarAlt /> {new Date(blog.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                            <h2>{blog.title}</h2>
                            <p>{blog.content.substring(0, 200)}.</p>
                            <a href={`/blog/${blog.blogId}`} className="read-more-btn">READ MORE</a>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default News;
