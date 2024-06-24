import React, { useEffect, useState } from 'react';
import axios from 'axios';

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
        <div>
            {blogs.map((blog) => (
                <div key={blog.blogId}>
                    <h2>{blog.title}</h2>
                    <p>{blog.content}</p>
                    {blog.imageUrl && <img src={`http://localhost:8080/api/v1/images/${blog.imageUrl}`} alt={blog.title} />}
                </div>
            ))}
        </div>
    );
};

export default News;
