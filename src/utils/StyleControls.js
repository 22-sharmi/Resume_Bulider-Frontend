import React, { useEffect, useRef, useState } from 'react';
import { SketchPicker } from 'react-color';
import { motion } from 'framer-motion';

const StyleControls = ({ styles, setStyles }) => {
  const fontFamilies = ['Arial', 'Helvetica', 'Times New Roman', 'Courier', 'Verdana', 'Georgia', 'Palatino', 'Garamond', 'Bookman', 'Comic Sans MS', 'Trebuchet MS', 'Arial Black', 'Impact'];
  const fontSizes = ['8px', '10px', '12px', '14px', '16px', '18px', '20px', '24px', '28px', '32px', '36px', '48px', '64px'];
  const fontWeights = ['100', '200', '300', '400', '500', '600', '700', '800', '900'];
  const textAligns = ['left', 'center', 'right', 'justify'];
  const colors = ['Red', 'Black', 'Green', 'Blue', 'Yellow', 'Cyan', 'Magenta', 'White', 'Other'];

  const [showTextColorPicker, setShowTextColorPicker] = useState(false);
  const [showLeftSideBgColorPicker, setShowLeftSideBgColorPicker] = useState(false);
  const [showHeaderBgColorPicker, setShowHeaderBgColorPicker] = useState(false);
  
  const textColorPickerRef = useRef(null);
  const leftSideBgColorPickerRef = useRef(null);
  const headerBgColorPickerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (textColorPickerRef.current && !textColorPickerRef.current.contains(event.target)) {
        setShowTextColorPicker(false);
      }
      if (leftSideBgColorPickerRef.current && !leftSideBgColorPickerRef.current.contains(event.target)) {
        setShowLeftSideBgColorPicker(false);
      }
      if (headerBgColorPickerRef.current && !headerBgColorPickerRef.current.contains(event.target)) {
        setShowHeaderBgColorPicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const ColorPickerButton = ({ color, onClick }) => (
    <div
      onClick={onClick}
      style={{
        background: color,
        width: '36px',
        height: '36px',
        borderRadius: '4px',
        cursor: 'pointer',
        border: '1px solid #ccc'
      }}
    />
  );

  return (
    <motion.div 
      className="flex flex-wrap items-center justify-start gap-4 p-4 mb-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Section 1: Font Family, Size, Alignment, and Weight */}
      <div className="flex items-center justify-between gap-4">
        <select
          value={styles.fontFamily}
          onChange={(e) => setStyles({ ...styles, fontFamily: e.target.value })}
          className="p-2 border rounded bg-transparent"
        >
          {fontFamilies.map(font => <option key={font} value={font}>{font}</option>)}
        </select>

        <select
          value={styles.fontSize}
          onChange={(e) => setStyles({ ...styles, fontSize: e.target.value })}
          className="p-2 border rounded bg-transparent"
        >
          {fontSizes.map(size => <option key={size} value={size}>{size}</option>)}
        </select>

        <select
          value={styles.fontWeight}
          onChange={(e) => setStyles({ ...styles, fontWeight: e.target.value })}
          className="p-2 border rounded bg-transparent"
        >
          {fontWeights.map(weight => <option key={weight} value={weight}>{weight}</option>)}
        </select>

        <select
          value={styles.textAlign}
          onChange={(e) => setStyles({ ...styles, textAlign: e.target.value })}
          className="p-2 border rounded bg-transparent"
        >
          {textAligns.map(align => <option key={align} value={align}>{align}</option>)}
        </select>
      </div>

      {/* Section 2: Theme (Left Text Color and Background Color) */}
      <div className="flex flex-wrap items-center justify-start gap-4">
        <p>Theme : </p>
        <div ref={textColorPickerRef} className='flex gap-5 items-center'>
          <label>Text Color: </label>
          <ColorPickerButton color={styles.textColor} onClick={() => setShowTextColorPicker(!showTextColorPicker)} />
          {showTextColorPicker && (
            <div style={{ position: 'absolute', zIndex: 2 }}>
              <SketchPicker
                color={styles.textColor}
                onChange={(color) => setStyles({ ...styles, textColor: color.hex })}
              />
            </div>
          )}
        </div>

        <div ref={leftSideBgColorPickerRef} className='flex gap-5 items-center'>
          <label>Background: </label>
          <ColorPickerButton color={styles.leftSideBackgroundColor} onClick={() => setShowLeftSideBgColorPicker(!showLeftSideBgColorPicker)} />
          {showLeftSideBgColorPicker && (
            <div style={{ position: 'absolute', zIndex: 2 }}>
              <SketchPicker
                color={styles.leftSideBackgroundColor}
                onChange={(color) => setStyles({ ...styles, leftSideBackgroundColor: color.hex })}
              />
            </div>
          )}
        </div>

        <div ref={headerBgColorPickerRef} className='flex gap-5 items-center'>
          <label>Header: </label>
          <ColorPickerButton color={styles.headerBackgroundColor} onClick={() => setShowHeaderBgColorPicker(!showHeaderBgColorPicker)} />
          {showHeaderBgColorPicker && (
            <div style={{ position: 'absolute', zIndex: 2 }}>
              <SketchPicker
                color={styles.headerBackgroundColor}
                onChange={(color) => setStyles({ ...styles, headerBackgroundColor: color.hex })}
              />
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default StyleControls;