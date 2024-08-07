import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { FaCalendarAlt, FaUser } from 'react-icons/fa';
import { useParams } from 'react-router-dom';
import './BlogDetail.scss';

const BlogDetail = () => {
    const { blogId } = useParams();
    const [blog, setBlog] = useState(null);

    useEffect(() => {
        const fetchBlog = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/v1/blogs/get/${blogId}`);
                console.log('API Response:', response.data);
                setBlog(response.data);
            } catch (error) {
                console.error('Error fetching blog details:', error);
                alert('Failed to fetch blog details. Please try again.');
            }
        };

        fetchBlog();
    }, [blogId]);

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

    if (!blog) {
        return <div>Loading...</div>;
    }

    const firstImageUrl = extractFirstImageUrl(blog.content);

    return (
        <div className='blog-detail'>
            <div className="blog-header-container">
                <div className="header-content">
                    <h1>{blog.title}</h1>
                    <div className="breadcrumb-blogdetail">
                        <a href="/">Home</a> / <a href="/news">News</a> / <span>{blog.title}</span>
                    </div>
                </div>
            </div>
            <div className="blog-content">
                {firstImageUrl && <img className="blog-image" src={firstImageUrl} alt={blog.title} />}
                <div className="blog-meta">
                    <span className="blog-date">
                        <FaCalendarAlt /> {formatDate(blog.createdAt)}
                    </span>
                    <span className="blog-author">
                        <FaUser /> {blog.author.userName}
                    </span>
                </div>
                <div
                    className="blog-text"
                    dangerouslySetInnerHTML={{ __html: blog.content }}
                />
            </div>
        </div>
    );
};

export default BlogDetail;
