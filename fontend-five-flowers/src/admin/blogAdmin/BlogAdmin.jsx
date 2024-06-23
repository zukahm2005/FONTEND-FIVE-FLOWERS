import React from 'react';
import { Link, Route, Routes } from 'react-router-dom';
import AddBlog from './addBlog/AddBlog';
import GetAllBlog from './getAllBlog/GetAllBlog';
import UpdateBlog from './updateBlog/UpdateBlog';

const BlogAdmin = () => {
  return (
    <div>
      <h2>Blog Admin</h2>
      <nav>
        <ul>
          <li>
            <Link to="add">Add Blog</Link>
          </li>
          <li>
            <Link to="get">Get All Blogs</Link>
          </li>
          <li>
            <Link to="update">Update Blog</Link>
          </li>
        </ul>
      </nav>
      <Routes>
        <Route path="add" element={<AddBlog />} />
        <Route path="get" element={<GetAllBlog />} />
        <Route path="update" element={<UpdateBlog />} />
      </Routes>
    </div>
  );
};

export default BlogAdmin;
