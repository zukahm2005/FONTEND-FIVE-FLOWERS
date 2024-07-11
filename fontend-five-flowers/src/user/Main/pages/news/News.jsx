import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaCalendarAlt, FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import './news.scss';

const News = () => {
    const [blogs, setBlogs] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const blogsPerPage = 4;

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

    const indexOfLastBlog = currentPage * blogsPerPage;
    const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
    const currentBlogs = blogs.slice(indexOfFirstBlog, indexOfLastBlog);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const totalPages = Math.ceil(blogs.length / blogsPerPage);

    const nextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const prevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

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

    const extractTextFromHtml = (htmlContent) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlContent, 'text/html');
        return doc.body.textContent || "";
    };

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
                {currentBlogs.map((blog) => (
                    <div key={blog.blogId} className="blog-item">
                        <img src={blog.imageUrl || extractFirstImageUrl(blog.content)} alt={blog.title} className="blog-image" />
                        <div className="blog-content">
                            <div className="blog-meta">
                                <span className="blog-date">
                                    <FaCalendarAlt /> {formatDate(blog.createdAt)}
                                </span>
                            </div>
                            <h2>{blog.title}</h2>
                            <p>{extractTextFromHtml(blog.content).substring(0, 200)}...</p>
                            <Link to={`/news/${blog.blogId}`} className="read-more-btn">READ MORE</Link>
                        </div>
                    </div>
                ))}
            </div>
            <div className='pagination'>
                <button onClick={prevPage} disabled={currentPage === 1}>
                    <FaArrowLeft />
                </button>
                {Array.from({ length: totalPages }, (_, index) => (
                    <button key={index + 1} onClick={() => paginate(index + 1)} className={currentPage === index + 1 ? 'active' : ''}>
                        {index + 1}
                    </button>
                ))}
                <button onClick={nextPage} disabled={currentPage === totalPages}>
                    <FaArrowRight />
                </button>
            </div>
        </div>
    );
};

export default News;
