import React, { useState, useRef, useCallback,useEffect, useContext } from "react";
import {
  FaArrowLeft,
  FaArrowRight,
  FaSave,
  FaDownload,
  FaUpload,
  FaPlus,
  FaMinus,
} from "react-icons/fa";
import { motion } from "framer-motion";
import axios from "axios";
import { toast } from "react-toastify";
import { BsFiletypePdf } from "react-icons/bs";
import { BiSolidBookmarks } from "react-icons/bi";
import { FaPenToSquare } from "react-icons/fa6";
import { useReactToPrint } from 'react-to-print';
import { AuthContext } from "../../../contexts/AuthContext";


const ResumeMobile1 = ({ resume, updateResumeData }) => {
  const [step, setStep] = useState(0);
  const [localResume, setLocalResume] = useState(resume || {});
  const [showPreview, setShowPreview] = useState(false);
  const [imageURL, setImageURL] = useState(
    resume?.personalInfo?.photo
  );
  const fileInputRef = useRef(null);
  const [isContentReady, setIsContentReady] = useState(false);
  const resumeContentRef = useRef(null);
  const { user} = useContext(AuthContext);


  useEffect(() => {
    const timer = setTimeout(() => {
      setIsContentReady(true);
    }, 1000); // Adjust this delay as needed

    return () => clearTimeout(timer);
  }, [localResume]);

  const handlePrint = useReactToPrint({
    content: () => resumeContentRef.current,
    documentTitle: user?.displayName ? `${user.displayName}'s Resume` : 'Resume',
    onAfterPrint: () => {
      toast.success('Printed PDF successfully!');
      console.log('Printed PDF successfully!');
    },
  });

  const sections = [
    { title: "Personal Info", key: "personalInfo" },
    { title: "Education", key: "Education" },
    { title: "Experience", key: "Experience" },
    { title: "Skills", key: "Skills" },
    { title: "Projects", key: "Projects" },
    { title: "Contact", key: "Contact" },
  ];

  const handleChange = (e, section, index, subIndex) => {
    const { name, value } = e.target;
    const updatedResume = { ...localResume };

    if (section === "Skills") {
      updatedResume[section] = updatedResume[section] || [];
      updatedResume[section][index] = updatedResume[section][index] || {
        skills: [],
      };
      updatedResume[section][index].skills[subIndex] = {
        ...updatedResume[section][index].skills[subIndex],
        [name]: value,
      };
    } else if (Array.isArray(updatedResume[section])) {
      updatedResume[section] = updatedResume[section] || [];
      updatedResume[section][index] = {
        ...updatedResume[section][index],
        [name]: value,
      };
    } else {
      updatedResume[section] = { ...updatedResume[section], [name]: value };
    }

    setLocalResume(updatedResume);
  };

  const handleImageClick = useCallback(() => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  }, []);

  const handleImageUpload = useCallback(
    async (e) => {
      const file = e.target.files[0];
      if (
        file &&
        ["image/jpg", "image/jpeg", "image/png"].includes(file.type)
      ) {
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
          const updatedResume = {
            ...localResume,
            personalInfo: { ...localResume.personalInfo, photo: newImageURL },
          };
          setLocalResume(updatedResume);
          updateResumeData(updatedResume);
          toast.success("Image uploaded!");
        } catch (error) {
          toast.error(`Error: ${error.message}`);
        }
      } else {
        toast.info("Invalid File Format");
      }
    },
    [localResume, updateResumeData]
  );

  const handleAddItem = (section, index = null) => {
    const updatedResume = { ...localResume };
    if (section === "Skills" && index !== null) {
      updatedResume.Skills[index].skills = [
        ...updatedResume.Skills[index].skills,
        { name: "", level: "" },
      ];
    } else {
      const newItem =
        section === "Education"
          ? { date: "", degree: "", university: "" }
          : section === "Skills"
          ? { category: "", skills: [{ name: "", level: "" }] }
          : section === "Experience"
          ? { date: "", company: "", position: "", description: "" }
          : section === "Projects"
          ? { name: "", description: "", link: "" }
          : section === "Contact"
          ? { label: "", value: "" }
          : {};

      updatedResume[section] = [...(updatedResume[section] || []), newItem];
    }
    setLocalResume(updatedResume);
  };

  const handleRemoveItem = (section, index, subIndex = null) => {
    const updatedResume = { ...localResume };
    if (section === "Skills" && subIndex !== null) {
      updatedResume.Skills[index].skills = updatedResume.Skills[
        index
      ].skills.filter((_, i) => i !== subIndex);
    } else {
      updatedResume[section] = updatedResume[section].filter(
        (_, i) => i !== index
      );
    }
    setLocalResume(updatedResume);
  };

  const handleNext = () => {
    if (step < sections.length - 1) {
      setStep(step + 1);
    } else {
      setShowPreview(true);
    }
  };

  const handlePrevious = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const handleSave = () => {
    updateResumeData(localResume);
  };

  const renderInputField = (section, field, index, subIndex) => {
    let value;
    if (section === "Skills") {
      value = localResume[section]?.[index]?.skills?.[subIndex]?.[field] || "";
    } else if (Array.isArray(localResume[section])) {
      value = localResume[section]?.[index]?.[field] || "";
    } else {
      value = localResume[section]?.[field] || "";
    }

    return (
      <input
        key={`${section}-${field}-${index}-${subIndex}`}
        type="text"
        name={field}
        value={value}
        onChange={(e) => handleChange(e, section, index, subIndex)}
        className="w-full p-2 mb-2 border rounded"
        placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
      />
    );
  };

  const renderSection = () => {
    const currentSection = sections[step];

    if (currentSection.key === "personalInfo") {
      return (
        <div>
          {Object.keys(localResume[currentSection.key] || {}).map((field) =>
            field === "photo" ? (
              <div key={field} className="mb-4">
                <button
                  onClick={() => fileInputRef.current.click()}
                  className="flex items-center px-4 py-2 bg-yellow-500 text-white rounded"
                >
                  <FaUpload className="mr-2" /> Upload Photo
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  onChange={handleImageUpload}
                  accept="image/*"
                  className="hidden"
                />
                <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                className="hidden"
              />
              <img
                src={resume?.personalInfo?.photo}
                alt="Profile"
                className="w-full h-full object-cover cursor-pointer"
                onClick={handleImageClick}
              />
                {localResume.personalInfo?.photo && (
                  <img
                    src={localResume.personalInfo.photo}
                    alt="Profile"
                    className="mt-2 w-32 h-32 object-cover rounded"
                  />
                )}
              </div>
            ) : (
              field !== "_id" && renderInputField(currentSection.key, field)
            )
          )}
        </div>
      );
    }

    if (currentSection.key === "Skills") {
      return (
        <div>
          {(localResume[currentSection.key] || []).map(
            (skillGroup, groupIndex) => (
              <div key={groupIndex} className="mb-4">
                <h3 className="font-semibold mb-2">
                  Skill Group {groupIndex + 1}
                </h3>
                {(skillGroup.skills || []).map((skill, skillIndex) => (
                  <div key={skillIndex} className="flex gap-2 mb-2">
                    {renderInputField(
                      currentSection.key,
                      "name",
                      groupIndex,
                      skillIndex
                    )}
                    {renderInputField(
                      currentSection.key,
                      "level",
                      groupIndex,
                      skillIndex
                    )}
                    <button
                      onClick={() =>
                        handleRemoveItem("Skills", groupIndex, skillIndex)
                      }
                      className="bg-red-500 text-white p-1 rounded"
                    >
                      <FaMinus />
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => handleAddItem("Skills", groupIndex)}
                  className="w-full bg-green-500 text-white p-1 rounded flex justify-center items-center mt-2"
                >
                  <FaPlus className="mr-2" /> Add Skill
                </button>
              </div>
            )
          )}
          <button
            onClick={() => handleAddItem("Skills")}
            className="w-full bg-blue-500 text-white p-2 rounded flex justify-center items-center"
          >
            <FaPlus className="mr-2" /> Add Category
          </button>
        </div>
      );
    }

    if (Array.isArray(localResume[currentSection.key])) {
      return (
        <div>
          {(localResume[currentSection.key] || []).map((item, index) => (
            <div key={index} className="mb-4">
              {Object.keys(item || {}).map(
                (field) =>
                  field !== "_id" &&
                  renderInputField(currentSection.key, field, index)
              )}
              <button
                onClick={() => handleRemoveItem(currentSection.key, index)}
                className="bg-red-500 text-white p-1 rounded"
              >
                <FaMinus />
              </button>
            </div>
          ))}
          <button
            onClick={() => handleAddItem(currentSection.key)}
            className="w-full bg-blue-500 text-white p-2 rounded flex justify-center items-center"
          >
            <FaPlus className="mr-2" /> Add {currentSection.title}
          </button>
        </div>
      );
    } else {
      return (
        <div>
          {Object.keys(localResume[currentSection.key] || {}).map(
            (field) =>
              field !== "_id" && renderInputField(currentSection.key, field)
          )}
        </div>
      );
    }
  };

  const renderPreview = () => {
    return (
      <div className="bg-white rounded shadow" id="resume-content">
        <div className="flex">
          <div className="w-2/5 bg-gray-900 text-white p-4">
            {localResume.personalInfo?.photo && (
              <img
                src={localResume?.personalInfo?.photo}
                alt="Profile"
                className="w-full mb-4 rounded-md"
              />
            )}
            <h3 className="text-lg font-semibold mb-2 border-b border-yellow-500">
              EDUCATION
            </h3>
            {(localResume.Education || []).map((edu, index) => (
              <div key={index} className="mb-2">
                <p className="font-bold">{edu.degree}</p>
                <p>{edu.university}</p>
                <p>{edu.date}</p>
              </div>
            ))}

            <h3 className="text-lg font-semibold mb-2 mt-4 border-b border-yellow-500">
              PROJECTS
            </h3>
            {(localResume.Projects || []).map((project, index) => (
              <div key={index} className="mb-2">
                <a href={project.link}>
                  {" "}
                  <p className="font-bold">{project.name}</p>
                </a>
                <p>{project.description}</p>
              </div>
            ))}

            <div className="mt-4">
              <h3 className="text-lg font-semibold mb-2 mt-4 border-b border-yellow-500">
                CONTACT
              </h3>
              {(localResume.Contact || []).map((contact, index) => (
                <div key={index}>
                  <p className="font-semibold">{contact.label}</p>
                  <p>{contact.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="w-2/3 py-4">
            <div className="bg-yellow-500">
              <h2 className="text-2xl font-bold mb-2">
                {localResume.personalInfo?.title}
              </h2>
              <p className="mb-4">{localResume.personalInfo?.subtitle}</p>
            </div>
            <div className="pl-1">
              <h3 className="text-xl font-semibold mb-2 border-b border-gray-300">
                ABOUT ME
              </h3>
              <p className="mb-4">{localResume.personalInfo?.description}</p>

              <h3 className="text-xl font-semibold mb-2 border-b border-gray-300">
                EXPERIENCE
              </h3>
              {(localResume.Experience || []).map((exp, index) => (
                <div key={index} className="mb-4">
                  <p className="font-bold">{exp.company}</p>
                  <p>{exp.position}</p>
                  <p>{exp.date}</p>
                  <p>{exp.description}</p>
                </div>
              ))}

              <h3 className="text-xl font-semibold mb-2 border-b border-gray-300">
                SKILLS
              </h3>
              {(localResume.Skills || []).map((skillGroup, groupIndex) => (
                <div key={groupIndex} className="mb-4">
                  {/* <h4 className="font-semibold mb-2">Skill Group {groupIndex + 1}</h4> */}
                  {(skillGroup.skills || []).map((skill, skillIndex) => (
                    <div
                      key={skillIndex}
                      className="flex items-center gap-2 mb-2"
                    >
                      <p className="font-bold">{skill.name}</p>
                      <div className="relative mt-1 w-full h-1 rounded-md bg-gray-400">
                        <div
                          className="h-full rounded-md bg-yellow-500"
                          style={{
                            width: `${skill.level}%`,
                            transition: "width 0.3s ease",
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };
  return (
    <div className="block md:hidden p-4">
      {!showPreview ? (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-xl font-bold mb-4">{sections[step].title}</h2>
          {renderSection()}
          <div className="flex justify-between mt-4">
            <button
              onClick={handlePrevious}
              disabled={step === 0}
              className="flex items-center px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
            >
              <FaArrowLeft className="mr-2" /> Previous
            </button>
            <button
              onClick={handleNext}
              className="flex items-center px-4 py-2 bg-yellow-500 text-white rounded"
            >
              {step === sections.length - 1 ? "Preview" : "Next"}{" "}
              <FaArrowRight className="ml-2" />
            </button>
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.5 }}
        >
          <div ref={resumeContentRef} className="bg-white rounded shadow">
            {/* ... resume content */}
            {renderPreview()}
          </div>
          
          <div className="flex justify-between mt-4">
            <button
              onClick={() => setShowPreview(false)}
              className="flex items-center px-4 py-2 bg-gray-200 rounded"
            >
              <FaPenToSquare className="mr-2" /> Edit
            </button>
            <button
            className="border flex items-center gap-2 border-gray-500 text-txtDark px-2 md:px-4 py-2 hover:text-white hover:bg-gray-500 rounded-md"
            onClick={handleSave}
          >
            <BiSolidBookmarks className="text-sm" />
            Save
          </button>
          <button
          //  onClick={generatePDF}
           onClick={handlePrint}
            className="border flex items-center gap-2 border-gray-500 text-txtDark px-2 md:px-4 py-2 hover:text-white hover:bg-gray-500 rounded-md"
          >
            <BsFiletypePdf className="text-2xl cursor-pointer" />
            Download PDF
          </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default ResumeMobile1;
