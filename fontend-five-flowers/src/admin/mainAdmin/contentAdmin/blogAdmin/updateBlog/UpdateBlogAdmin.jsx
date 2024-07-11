import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './UpdateBlogAdmin.scss';

const UpdateBlogAdmin = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        const checkTokenExpiry = () => {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }

            const payload = JSON.parse(atob(token.split('.')[1]));
            const expiry = payload.exp;
            const now = Date.now() / 1000;

            if (now > expiry) {
                alert('Session expired. Please log in again.');
                localStorage.removeItem('token');
                navigate('/login');
            }
        };

        checkTokenExpiry();
    }, [navigate]);

    useEffect(() => {
        const fetchBlog = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/v1/blogs/get/${id}`);
                setTitle(response.data.title);
                setContent(response.data.content);
            } catch (error) {
                console.error('Error fetching the blog:', error);
            }
        };

        fetchBlog();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const blog = { title, content };

        try {
            await axios.put(`http://localhost:8080/api/v1/blogs/update/${id}`, blog, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            alert('Blog updated successfully');
            navigate('/admin/blogs');
        } catch (error) {
            console.error(error);
            alert('Failed to update blog');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="update-blog-form">
            <div className="form-group">
                <label>Title</label>
                <input
                    type="text"
                    placeholder="e.g. Blog about your latest products or deals"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
            </div>
            <div className="form-group">
                <label>Content</label>
                <CKEditor
                    editor={ClassicEditor}
                    data={content}
                    config={{
                        extraPlugins: [MyCustomUploadAdapterPlugin],
                    }}
                    onChange={(event, editor) => {
                        const data = editor.getData();
                        setContent(data);
                    }}
                />
            </div>
            <button type="submit">Update Blog</button>
        </form>
    );
};

function MyCustomUploadAdapterPlugin(editor) {
    editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
        return new MyUploadAdapter(loader);
    };
}

class MyUploadAdapter {
    constructor(loader) {
        this.loader = loader;
    }

    upload() {
        return this.loader.file
            .then(file => new Promise((resolve, reject) => {
                const formData = new FormData();
                formData.append('file', file);

                axios.post('http://localhost:8080/api/v1/blogs/upload', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                })
                .then(response => {
                    resolve({
                        default: response.data.url
                    });
                })
                .catch(error => {
                    reject(error);
                });
            }));
    }

    abort() {
        // Implement abort functionality if needed
    }
}

export default UpdateBlogAdmin;
