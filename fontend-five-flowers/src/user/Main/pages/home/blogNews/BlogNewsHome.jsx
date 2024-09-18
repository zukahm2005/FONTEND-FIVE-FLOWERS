import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaCalendarAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import "./blogNewHome.scss";

const BlogNew = () => {
  const [blogs, setBlogs] = useState([]); // Mặc định là một mảng rỗng

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/v1/blogs/all"
        );
        console.log("Response data:", response.data.content); // Kiểm tra dữ liệu từ API

        if (Array.isArray(response.data.content)) {
          setBlogs(response.data.content); // Chỉ setBlogs nếu dữ liệu là một mảng
        } else {
          console.error("API did not return an array");
          setBlogs([]); // Đảm bảo blogs luôn là mảng
        }
      } catch (error) {
        console.error("Error fetching blogs:", error);
        setBlogs([]); // Đảm bảo blogs luôn là mảng khi xảy ra lỗi
      }
    };

    fetchBlogs();
  }, []);

  const formatDate = (dateArray) => {
    if (Array.isArray(dateArray)) {
      const [year, month, day] = dateArray;
      return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(
        2,
        "0"
      )}`;
    }
    return "Invalid Date";
  };

  const extractFirstImageUrl = (htmlContent) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, "text/html");
    const img = doc.querySelector("img");
    return img ? img.src : null;
  };

  return (
    <div className="blog-new-container">
      <h2>Our Latest News</h2>
      <div className="blog-list">
        {Array.isArray(blogs) && blogs.length > 0 ? (
          blogs.slice(0, 3).map(blog => (
            blog && ( // Kiểm tra blog có tồn tại trước khi hiển thị
              <div key={blog.blogId} className="blog-item">
                <img
                  src={blog.imageUrl || extractFirstImageUrl(blog.content)}
                  alt={blog.title}
                  className="blog-image-home"
                  onError={(e) => {
                    e.target.src = "/fallback-image.jpg";
                  }}
                />
                <div className="blog-meta">
                  <span className="blog-date">
                    <FaCalendarAlt /> {formatDate(blog.createdAt)}
                  </span>
                </div>
                <h3>{blog.title}</h3>
                <p>{blog.content.substring(0, 100)}...</p>
                <Link to={`/news/${blog.blogId}`} className="read-more-btn">
                  READ MORE
                </Link>
              </div>
            )
          ))
        ) : (
          <p>No blogs available at the moment.</p>
        )}
      </div>
    </div>
  );
};

export default BlogNew;
