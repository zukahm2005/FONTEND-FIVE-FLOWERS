import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { FaCalendarAlt, FaComment } from 'react-icons/fa';
import './blogNewHome.scss'

const BlogNew = () => {
    const [blogs, setBlogs] = useState([]);

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/v1/blogs/all');
                setBlogs(response.data.content);
            } catch (error) {
                console.error('Error fetching blogs:', error);
            }
        };

        fetchBlogs();
    }, []);

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    return (
        <div className='blog-new-container'>
            <h2>Our Latest News</h2>
            <div className='blog-list'>
                {blogs.slice(0, 3).map(blog => (  // Chỉ lấy 3 bài blog đầu tiên
                    <div key={blog.blogId} className='blog-item'>
                        <img src={`http://localhost:8080/api/v1/images/${blog.imageUrl}`} alt={blog.title} className='blog-image' />
                        <div className='blog-meta'>
                            <span className='blog-date'>
                                <FaCalendarAlt /> {formatDate(blog.createdAt)}
                            </span>
                            <span className='blog-comments'>
                                <FaComment /> {blog.commentsCount} Comment{blog.commentsCount !== 1 ? 's' : ''}
                            </span>
                        </div>
                        <h3>{blog.title}</h3>
                        <p>{blog.content.substring(0, 100)}...</p>
                        <a href={`/news/${blog.blogId}`} className='read-more-btn'>READ MORE</a>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BlogNew;
