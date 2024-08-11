import React, { useState } from 'react';
import QuillEditor from './ui/Quill';

const MyComponent: React.FC = () => {
  const [content, setContent] = useState<string>('');

  const handleChange = (value: string) => {
    setContent(value);
  };

  return (
    <div>
      <h1>My Rich Text Editor</h1>
      <QuillEditor
        value={content}
        onChange={handleChange}
        placeholder="Start typing..."
      />
      <div>
        <h2>Editor Content:</h2>
        <div dangerouslySetInnerHTML={{ __html: content }} />
      </div>
    </div>
  );
};

export default MyComponent;