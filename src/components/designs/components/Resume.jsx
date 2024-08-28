import React, { useState, useEffect, useCallback, useRef } from "react";
import ColorPicker from "./ColorPicker";
import { toast } from "react-toastify";
import axios from "axios";
import { TemplateOne } from "../../../assets";

export default function ResumeSection({ resume, updateResumeData }) {
  const [selectedText, setSelectedText] = useState("");
  const [selectedElement, setSelectedElement] = useState(null);
  const [editedText, setEditedText] = useState("");
  const [showStyleOptions, setShowStyleOptions] = useState(false);
  const [imageURL, setImageURL] = useState(TemplateOne);
  const fileInputRef = useRef(null);

  const handleImageClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleSelection = useCallback(() => {
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const text = range.toString();
      if (text) {
        setSelectedText(text);
        setEditedText(text);
        setSelectedElement(range.commonAncestorContainer.parentElement);
        setShowStyleOptions(true);
      } else {
        setShowStyleOptions(false);
      }
    }
  }, []);

  useEffect(() => {
    document.addEventListener("mouseup", handleSelection);
    return () => document.removeEventListener("mouseup", handleSelection);
  }, [handleSelection]);

  const handleStyleChange = (property, value) => {
    if (selectedElement && selectedElement.style) {
      selectedElement.style[property] = value;
      updateResumeData({ ...resume });
    }
  };

  const handleTextChange = (e) => {
    setEditedText(e.target.value);
  };

  const applyTextChange = () => {
    if (selectedElement) {
      selectedElement.innerHTML = selectedElement.innerHTML.replace(
        selectedText,
        editedText
      );
      updateResumeData({ ...resume });
    }
  };

  const isAllowed = (file) => {
    const allowedTypes = ["image/jpg", "image/jpeg", "image/png"];
    return allowedTypes.includes(file.type);
  };

  // Handling the image change
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];

    if (file && isAllowed(file)) {
      const formData = new FormData();
      formData.append("file", file);
      try {
        const response = await axios.post(
          "http://localhost:5555/api/upload",
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
        const newImageURL = `http://localhost:5555${response.data.url}`;
        setImageURL(newImageURL);
        updateResumeData({
          ...resume,
          personalInfo: { ...resume.personalInfo, photo: newImageURL },
        });
        toast.success("Image uploaded!");
      } catch (error) {
        toast.error(`Error: ${error.message}`);
      }
    } else {
      toast.info("Invalid File Format");
    }
  };

  if (!resume) return <div>Loading...</div>;

  const { personalInfo, Education, Contact, Skills, Experience, Projects } =
    resume;

  return (
    <div className="flex-1 bg-white p-8 overflow-y-auto" id="resume-content">
      {showStyleOptions && (
        <div className="fixed top-0 right-0 bg-white p-4 shadow-md z-50">
          <h3 className="text-lg font-semibold mb-2">Style Options</h3>
          <textarea
            className="w-full p-2 border rounded mb-2"
            value={editedText}
            onChange={handleTextChange}
          />
          <button
            className="bg-blue-500 text-white p-2 rounded mb-2"
            onClick={applyTextChange}
          >
            Apply Changes
          </button>
          <div className="mb-2">
            <label className="block mb-1">Font Weight</label>
            <select
              className="w-full p-1 border rounded"
              onChange={(e) => handleStyleChange("fontWeight", e.target.value)}
            >
              <option value="normal">Normal</option>
              <option value="bold">Bold</option>
            </select>
          </div>
          <div className="mb-2">
            <label className="block mb-1">Font Size</label>
            <input
              type="number"
              className="w-full p-1 border rounded"
              onChange={(e) =>
                handleStyleChange("fontSize", `${e.target.value}px`)
              }
            />
          </div>
          <div className="mb-2">
            <label className="block mb-1">Font Family</label>
            <select
              className="w-full p-1 border rounded"
              onChange={(e) => handleStyleChange("fontFamily", e.target.value)}
            >
              <option value="Arial, sans-serif">Arial</option>
              <option value="Helvetica, sans-serif">Helvetica</option>
              <option value="Times New Roman, serif">Times New Roman</option>
              <option value="Courier New, monospace">Courier New</option>
            </select>
          </div>
          <div className="mb-2">
            <label className="block mb-1">Text Alignment</label>
            <select
              className="w-full p-1 border rounded"
              onChange={(e) => handleStyleChange("textAlign", e.target.value)}
            >
              <option value="left">Left</option>
              <option value="center">Center</option>
              <option value="right">Right</option>
            </select>
          </div>
          <div className="mb-2">
            <label className="block mb-1">Color</label>
            <ColorPicker
              onChange={(color) => handleStyleChange("color", color)}
            />
          </div>
        </div>
      )}

      <div className="flex">
        {/* Left column */}
        <div className="w-1/3 bg-gray-900 text-white p-6">
          <div className="mb-4">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              className="hidden"
            />
            <img
              src={resume?.personalInfo?.photo}
              alt="Profile"
              className="w-full h-full object-cover rounded-md cursor-pointer"
              onClick={handleImageClick}
            />
          </div>

          <Section title="EDUCATION">
            {Education.map((edu, index) => (
              <div key={`edu-${index}`} className="mb-4">
                <p className="font-bold">{edu.degree}</p>
                <p>{edu.university}</p>
                <p>{edu.date}</p>
              </div>
            ))}
          </Section>

          <Section title="PROJECTS">
      {resume?.Projects?.map((project, index) => (
        <div key={`pro-${index}`} className="mb-4 p-4 border rounded">
          <p className="font-bold text-lg">{project.name}</p>
          {project.link && (
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              {project.link}
            </a>
          )}
        </div>
      ))}
    </Section>

          <Section title="CONTACT">
            {Contact.filter((c) => c.label !== "Reference").map(
              (contact, index) => (
                <p key={`con-${index}`}>
                  {contact.label}: {contact.value}
                </p>
              )
            )}
          </Section>
        </div>

        {/* Right column */}
        <div className="w-2/3 p-6">
          <div className="bg-yellow-400 py-4 px-6 mb-6">
            <h1 className="text-3xl font-bold">{personalInfo.title}</h1>
            <h2 className="text-xl">{personalInfo.subtitle}</h2>
          </div>

          <Section title="ABOUT ME">
            <p>{personalInfo.description}</p>
          </Section>

          <Section title="WORK EXPERIENCE">
            {Experience.map((exp, index) => (
              <div key={`exp-${index}`} className="mb-4">
                <div className="flex justify-between gap-6">
                  <div className="w-full">
                    <span className="font-bold">{exp.date}</span>
                  </div>
                  <div className="">
                    <span className="font-bold">{exp.position}</span>
                    <p>{exp.company}</p>
                    <p>{exp.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </Section>

          <Section title="SOFTWARE SKILL">
            <div className="grid grid-cols-2 gap-4">
              {resume?.Skills?.flatMap((skillGroup) =>
                skillGroup.skills.map((skillItem, skillIndex) => (
                  <div
                    key={skillIndex}
                    className="flex justify-between items-center mb-2"
                  >
                    <span className="flex-1">{skillItem.name}</span>
                    <span className="w-1/2 h-2 bg-gray-200 rounded-full">
                      <div
                        className="h-full bg-yellow-500 rounded-full"
                        style={{ width: `${skillItem.level}%` }}
                      ></div>
                    </span>
                  </div>
                ))
              )}
            </div>
          </Section>
        </div>
      </div>
    </div>
  );
}

const Section = React.memo(({ title, children }) => {
  return (
    <div className="mb-6">
      <h3 className="text-xl font-semibold mb-2 border-b border-gray-300 pb-1">
        {title}
      </h3>
      {children}
    </div>
  );
});
