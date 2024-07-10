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
                onChange={onChange}
                onBlur={ (event, editor) => {
                    console.log('Blur.', editor);
                } }
                onFocus={ (event, editor) => {
                    console.log('Focus.', editor);
                } }
            />
        </div>
    );
}

export default CKEditorComponent;
