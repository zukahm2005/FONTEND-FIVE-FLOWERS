import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import React, { useState } from 'react';

const CKEditorComponent = ({ data, onChange }) => {
    const [editorData, setEditorData] = useState(data);

    const handleEditorChange = (event, editor) => {
        const data = editor.getData();
        setEditorData(data);
        onChange(event, editor, data);
    };

    return (
        <div className="App">
            <CKEditor
                editor={ ClassicEditor }
                data={editorData}
                onReady={ editor => {
                    console.log('Editor is ready to use!', editor);
                } }
                onChange={handleEditorChange}
                onBlur={ (event, editor) => {
                    console.log('Blur.', editor);
                } }
                onFocus={ (event, editor) => {
                    console.log('Focus.', editor);
                } }
                config={{
                    toolbar: [
                        'heading', '|',
                        'bold', 'italic', 'link', 'bulletedList', 'numberedList', 'blockQuote'
                    ],
                    language: 'en',
                }}
            />
        </div>
    );
}

export default CKEditorComponent;
