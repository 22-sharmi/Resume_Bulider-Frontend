import React, { useState } from 'react';

const EditableField = ({ value, onChange, multiline }) => {
  const [isEditing, setIsEditing] = useState(false);

  const handleBlur = () => {
    setIsEditing(false);
  };

  const handleChange = (e) => {
    onChange(e.target.value);
  };

  return (
    <div onClick={() => setIsEditing(true)} className="editable-field">
      {isEditing ? (
        multiline ? (
          <textarea
            className="w-full p-2 border rounded"
            value={value}
            onChange={handleChange}
            onBlur={handleBlur}
            autoFocus
          />
        ) : (
          <input
            type="text"
            className="w-full p-2 border rounded"
            value={value}
            onChange={handleChange}
            onBlur={handleBlur}
            autoFocus
          />
        )
      ) : (
        <p className="w-full p-2 border-b border-dotted">{value}</p>
      )}
    </div>
  );
};

export default EditableField;
