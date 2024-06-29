import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const GetAllBlogAdmin = () => {
  const [blogs, setBlogs] = useState([]);
  const navigate = useNavigate();

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

  const handleAddBlog = () => {
    navigate('/admin/blog/add');
  };

  return (
    <div className='news-container'>
      <button onClick={handleAddBlog}>Create Blog Post</button>
      <div className='blog-list-container'>
        {blogs.map((blog) => (
          <div key={blog.blogId} className="blog-item">
            <img src={`http://localhost:8080/api/v1/images/${blog.imageUrl}`} alt={blog.title} className="blog-image" />
            <div className="blog-content">
              <h2>{blog.title}</h2>
              <p>{blog.content.substring(0, 200)}...</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GetAllBlogAdmin;
