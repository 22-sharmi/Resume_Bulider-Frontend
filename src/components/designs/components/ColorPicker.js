import React from 'react';

function ColorPicker({ onChange }) {
  const colors = ['#000000', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF'];

  return (
    <div className="flex flex-wrap">
      {colors.map((color) => (
        <button
          key={color}
          className="w-8 h-8 m-1 border rounded"
          style={{ backgroundColor: color }}
          onClick={() => onChange(color)}
        />
      ))}
      <input
        type="color"
        onChange={(e) => onChange(e.target.value)}
        className="w-8 h-8 m-1"
      />
    </div>
  );
}

export default ColorPicker;