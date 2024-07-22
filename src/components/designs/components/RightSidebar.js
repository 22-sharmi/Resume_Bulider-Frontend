import React, { useEffect, useState } from 'react';
import ColorPicker from './ColorPicker';

function RightSidebar({ updateResumeData, resume }) {
  const [selectedText, setSelectedText] = useState('');
  const [selectedElement, setSelectedElement] = useState(null);
  const [editedText, setEditedText] = useState('');

  useEffect(() => {
    const handleSelection = () => {
      const selection = window.getSelection();
      if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const text = range.toString();
        if (text) {
          setSelectedText(text);
          setEditedText(text);
          setSelectedElement(range.commonAncestorContainer.parentElement);
        }
      }
    };

    document.addEventListener('mouseup', handleSelection);
    return () => document.removeEventListener('mouseup', handleSelection);
  }, []);

  const handleStyleChange = (property, value) => {
    if (selectedElement && selectedElement.style) {
      selectedElement.style[property] = value;
    }
  };
  

  const handleTextChange = (e) => {
    setEditedText(e.target.value);
  };

  const applyTextChange = () => {
    if (selectedElement) {
      selectedElement.innerHTML = selectedElement.innerHTML.replace(selectedText, editedText);
    }
  };

  return (
    <div className="bg-white p-4 overflow-y-auto">
      <h2 className="text-xl font-semibold mb-4">Styling Options</h2>

      {selectedText && (
        <>
          <p>Selected text: {selectedText}</p>
          <textarea
            className="w-full p-2 border rounded mb-4"
            value={editedText}
            onChange={handleTextChange}
          />
          <button 
            className="bg-blue-500 text-white p-2 rounded mb-4"
            onClick={applyTextChange}
          >
            Apply Changes
          </button>
          
          <div className="mb-4">
            <label className="block mb-2">Font Weight</label>
            <select
              className="w-full p-2 border rounded"
              onChange={(e) => handleStyleChange('fontWeight', e.target.value)}
            >
              <option value="normal">Normal</option>
              <option value="bold">Bold</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block mb-2">Font Size</label>
            <input
              type="number"
              className="w-full p-2 border rounded"
              onChange={(e) => handleStyleChange('fontSize', `${e.target.value}px`)}
            />
          </div>

          <div className="mb-4">
            <label className="block mb-2">Font Family</label>
            <select
              className="w-full p-2 border rounded"
              onChange={(e) => handleStyleChange('fontFamily', e.target.value)}
            >
              <option value="Arial, sans-serif">Arial</option>
              <option value="Helvetica, sans-serif">Helvetica</option>
              <option value="Times New Roman, serif">Times New Roman</option>
              <option value="Courier New, monospace">Courier New</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block mb-2">Text Alignment</label>
            <select
              className="w-full p-2 border rounded"
              onChange={(e) => handleStyleChange('textAlign', e.target.value)}
            >
              <option value="left">Left</option>
              <option value="center">Center</option>
              <option value="right">Right</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block mb-2">Color</label>
            <ColorPicker
              onChange={(color) => handleStyleChange('color', color)}
            />
          </div>
        </>
      )}
    </div>
  );
}

export default RightSidebar;
