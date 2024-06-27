import axios from 'axios';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import React, { useState } from 'react';

const AddBlog = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [imageFile, setImageFile] = useState(null);

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
            const response = await axios.post('http://localhost:8080/api/v1/blogs/add', blog, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            console.log(response.data);
            alert('Blog added successfully');
        } catch (error) {
            console.error(error);
            alert('Failed to add blog');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Title:</label>
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>
            <div>
                <label>Content:</label>
                <CKEditor
                    editor={ClassicEditor}
                    data={content}
                    onChange={(event, editor) => {
                        const data = editor.getData();
                        setContent(data);
                    }}
                />
            </div>
            <div>
                <label>Image File:</label>
                <input type="file" onChange={(e) => setImageFile(e.target.files[0])} />
            </div>
            <button type="submit">Add Blog</button>
        </form>
    );
};

export default AddBlog;
