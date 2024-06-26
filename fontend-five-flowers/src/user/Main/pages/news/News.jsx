import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaCalendarAlt } from 'react-icons/fa'; // Import các biểu tượng bạn cần
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa'; // Import các biểu tượng mũi tên
import './news.scss'; // Đường dẫn đến file SCSS của bạn

const News = () => {
    const [blogs, setBlogs] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const blogsPerPage = 4; // Số bài blog mỗi trang

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

    // Logic phân trang
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
                        <img src={`http://localhost:8080/api/v1/images/${blog.imageUrl}`} alt={blog.title} className="blog-image" />
                        <div className="blog-content">
                            <div className="blog-meta">
                                <span className="blog-date">
                                    <FaCalendarAlt /> {new Date(blog.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                            <h2>{blog.title}</h2>
                            <p>{blog.content.substring(0, 200)}...</p>
                            <a href={`/blog/${blog.blogId}`} className="read-more-btn">READ MORE</a>
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
