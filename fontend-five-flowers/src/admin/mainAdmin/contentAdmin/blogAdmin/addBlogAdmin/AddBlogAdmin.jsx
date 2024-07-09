import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import './AddBlogAdmin.scss';
import { useNavigate } from 'react-router-dom';

const AddBlogAdmin = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [searchKeyword, setSearchKeyword] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const navigate = useNavigate();

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

    const handleImageUpload = async () => {
        const formData = new FormData();
        formData.append('file', imageFile);

        try {
            const response = await axios.post('http://localhost:8080/api/v1/blogs/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error uploading file:', error);
            alert('Failed to upload image');
            return null;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const imageUrl = await handleImageUpload();
        if (!imageUrl) return;

        const blog = { title, content, imageUrl };

        try {
            await axios.post('http://localhost:8080/api/v1/blogs/add', blog, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            alert('Blog added successfully');
        } catch (error) {
            console.error(error);
            alert('Failed to add blog');
        }
    };

    const handleSearch = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/api/v1/blogs/search?keyword=${searchKeyword}`);
            setSearchResults(response.data.articles.slice(0, 10)); // Lấy 10 bài viết đầu tiên
        } catch (error) {
            console.error('Error searching articles:', error);
        }
    };

    const handleSelectArticle = async (article) => {
        try {
            await axios.post('http://localhost:8080/api/v1/blogs/process-article', article, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            alert('Article processed and saved successfully');
        } catch (error) {
            console.error('Error processing article:', error);
            alert('Failed to process article');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="add-blog-form">
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
            <div className="form-group">
                <label>Image File</label>
                <input
                    type="file"
                    onChange={(e) => setImageFile(e.target.files[0])}
                />
            </div>
            <div className="form-group">
                <label>Search Keyword</label>
                <input
                    type="text"
                    placeholder="Enter keyword to search articles"
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                />
                <button type="button" onClick={handleSearch}>Search</button>
            </div>
            <div className="search-results">
                {searchResults.map((article, index) => (
                    <div key={index} className="search-result-item">
                        <h3>{article.title}</h3>
                        <p>{article.description}</p>
                        <button type="button" onClick={() => handleSelectArticle(article)}>Select</button>
                    </div>
                ))}
            </div>
            <button type="submit">Post Blog</button>
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

export default AddBlogAdmin;
