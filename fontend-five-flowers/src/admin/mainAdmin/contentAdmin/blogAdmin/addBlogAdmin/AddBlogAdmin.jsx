import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Table, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import './AddBlogAdmin.scss';

const AddBlogAdmin = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
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

    const handleSubmit = async (e) => {
        e.preventDefault();

        const blog = { title, content };

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
            const response = await axios.get('http://localhost:8080/api/v1/blogs/search?keyword=' + encodeURIComponent('Bicycles OR bicycle racing OR bicycle maintenance OR bicycle accessories OR effects of cycling'));
            setSearchResults(response.data.articles.slice(0, 10)); // Lấy 10 bài viết đầu tiên
        } catch (error) {
            console.error('Error searching articles:', error);
        }
    };

    const handleAutoPost = async () => {
        try {
            await axios.post('http://localhost:8080/api/v1/blogs/auto-post', {}, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            alert('Auto post blog successfully');
        } catch (error) {
            console.error('Error auto posting blog:', error);
        }
    };

    const handleSelectArticle = async (article) => {
        try {
            const response = await axios.post('http://localhost:8080/api/v1/blogs/process-article', article, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            const fullArticle = response.data;
            setTitle(fullArticle.title);
            setContent(fullArticle.content);
        } catch (error) {
            console.error('Error processing article:', error);
        }
    };

    const columns = [
        {
            title: 'Avatar',
            dataIndex: 'urlToImage',
            key: 'urlToImage',
            render: (text) => <img src={text} alt="avatar" style={{ width: 50, height: 50 }} />,
        },
        {
            title: 'Title',
            dataIndex: 'title',
            key: 'title',
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Button type="link" onClick={() => handleSelectArticle(record)}>
                    Select
                </Button>
            ),
        },
    ];

    return (
        <form onSubmit={handleSubmit} className="add-blog-form">
            <div className="form-group">
                <label>Title</label>
                <input
                    type="text"
                    placeholder="post title"
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
                <Button type="primary" onClick={handleSearch}>
                    Search Latest Bicycle News
                </Button>
                <Button type="default" onClick={handleAutoPost} style={{ marginLeft: '10px' }}>
                    Auto Post Blog
                </Button>
            </div>
            <div className="search-results">
                <Table columns={columns} dataSource={searchResults} rowKey="url" pagination={false} />
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
