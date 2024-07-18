import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import React from 'react';

const CKEditorComponent = ({ data, onChange }) => {
    return (
        <div className="App">
            <CKEditor
                editor={ ClassicEditor }
                data={data}
                onReady={ editor => {
                    console.log('Editor is ready to use!', editor);
                } }
                onChange={ (event, editor) => {
                    const data = editor.getData();
                    onChange(event, editor, data);
                }}
                onBlur={ (event, editor) => {
                    console.log('Blur.', editor);
                } }
                onFocus={ (event, editor) => {
                    console.log('Focus.', editor);
                } }
                config={{
                    toolbar: [
                        'heading', '|',
                        'bold', 'italic', 'underline', 'link', 'bulletedList', 'numberedList', 'blockQuote'
                    ],
                }}
            />
        </div>
    );
}

export default CKEditorComponent;
