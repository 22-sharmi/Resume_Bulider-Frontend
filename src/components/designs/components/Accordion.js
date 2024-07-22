import React, { useState } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

function Accordion({ title, children }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-gray-300 bg-white rounded mb-2 text-txtPrimary">
      <button
        className="w-full flex justify-between items-center text-left p-2 font-semibold"
        onClick={() => setIsOpen(!isOpen)}
      >
        {title}
        <span>
          {isOpen ? <FaChevronUp /> : <FaChevronDown />}
        </span>
      </button>
      {isOpen && <div className="p-2">{children}</div>}
    </div>
  );
}

export default Accordion;
