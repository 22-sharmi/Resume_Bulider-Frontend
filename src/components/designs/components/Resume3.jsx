import React, { useCallback, useRef, useState } from "react";
import { FaTrash, FaPlus, FaPenToSquare, FaPencil } from "react-icons/fa6";
import { motion, AnimatePresence } from "framer-motion";
import { TemplateOne } from "../../../assets";
import { BiSolidBookmarks } from "react-icons/bi";
import { BsFiletypePdf } from "react-icons/bs";
import axios from "axios";
import { toast } from "react-toastify";
import MainSpinner from "../../MainSpinner";
import { useResume } from "../../../hooks/useResume";

const Resume = ({ resume, updateResumeData }) => {
  const [isEdit, setIsEdit] = useState(false);
  const [localResume, setLocalResume] = useState(resume);
  const { generatePDF } = useResume();
  const fileInputRef = useRef(null);
  const [imageURL, setImageURL] = useState(
    resume?.personalInfo?.photo || TemplateOne
  );

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
          updateResumeData({
            ...localResume,
            personalInfo: { ...localResume.personalInfo, photo: newImageURL },
          });
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

  if (!localResume) return <MainSpinner />;

  const toggleEditable = () => {
    setIsEdit(!isEdit);
  };

  const handleChange = (e, section, index, subIndex = 0) => {
    const { name, value } = e.target;
    const updatedResume = { ...localResume };
    if (section === "Skills") {
      updatedResume[section][subIndex].skills[index] = {
        ...updatedResume[section][subIndex].skills[index],
        [name]: value,
      };
    } else if (index !== undefined) {
      updatedResume[section][index] = {
        ...updatedResume[section][index],
        [name]: value,
      };
    } else {
      updatedResume[section] = { ...updatedResume[section], [name]: value };
    }
    setLocalResume(updatedResume);
  };

  const addItem = (section) => {
    const updatedResume = JSON.parse(JSON.stringify(localResume));
    const sectionKey = section.charAt(0).toUpperCase() + section.slice(1);
    if (!Array.isArray(updatedResume[sectionKey])) {
      updatedResume[sectionKey] = [];
    }
    if (section === "skills") {
      if (updatedResume[sectionKey].length === 0) {
        updatedResume[sectionKey] = getEmptyItem(section);
      } else {
        updatedResume[sectionKey][0].skills.push({ name: "", level: "" });
      }
    } else {
      updatedResume[sectionKey] = [
        ...updatedResume[sectionKey],
        getEmptyItem(section),
      ];
    }
    setLocalResume(updatedResume);
  };

  const removeItem = (section, index, subIndex = 0) => {
    const updatedResume = { ...localResume };
    const sectionKey = section.charAt(0).toUpperCase() + section.slice(1);

    if (section === "Skills") {
      if (updatedResume[sectionKey][subIndex]?.skills) {
        updatedResume[sectionKey][subIndex].skills = updatedResume[
          sectionKey
        ][subIndex].skills.filter((_, i) => i !== index);
        if (updatedResume[sectionKey][subIndex].skills.length === 0) {
          updatedResume[sectionKey] = updatedResume[sectionKey].filter(
            (_, i) => i !== subIndex
          );
        }
      }
    } else {
      updatedResume[sectionKey] = updatedResume[sectionKey].filter(
        (_, i) => i !== index
      );
    }
    setLocalResume(updatedResume);
  };

  const getEmptyItem = (section) => {
    switch (section) {
      case "education":
        return { degree: "", university: "", date: "" };
      case "experience":
        return { date: "", position: "", company: "", description: "" };
      case "skills":
        return [{ skills: [{ name: "", level: "75" }] }];
      case "projects":
        return { name: "", description: "", link: "" };
      default:
        return {};
    }
  };

  const saveChanges = () => {
    updateResumeData(localResume);
    toast.success("Changes saved successfully!");
  };

  return (
    <div className="w-full flex flex-col items-center justify-start gap-4">
      <div className="w-full lg:w-[900px] grid grid-cols-12 px-6 lg:px-32">
        <div className="col-span-12 px-4 py-6">
          <div className="flex items-center justify-end w-full gap-12 mb-4">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="border flex items-center gap-2 border-gray-500 text-gray-700 px-4 py-2 hover:text-white hover:bg-gray-500 rounded-md cursor-pointer"
              onClick={toggleEditable}
            >
              {isEdit ? (
                <FaPenToSquare className="text-sm" />
              ) : (
                <FaPencil className="text-sm" />
              )}
              <p className="text-sm">{isEdit ? "Finish Editing" : "Edit"}</p>
            </motion.div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="border flex items-center gap-2 border-gray-500 text-gray-700 px-4 py-2 hover:text-white hover:bg-gray-500 rounded-md"
              onClick={saveChanges}
            >
              <BiSolidBookmarks className="text-sm" />
              Save
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={generatePDF}
              className="border flex items-center gap-2 border-gray-500 text-gray-700 px-4 py-2 hover:text-white hover:bg-gray-500 rounded-md"
            >
              <BsFiletypePdf className="text-2xl cursor-pointer" />
              Download PDF
            </motion.button>
          </div>
          <div id="resume-content">
          <div className="w-full max-w-4xl mx-auto bg-white shadow-lg">
            <div className="p-8">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center mb-8"
              >
                <input
                  type="text"
                  readOnly={!isEdit}
                  name="title"
                  value={localResume.personalInfo?.title}
                  onChange={(e) => handleChange(e, "personalInfo")}
                  className="text-4xl font-bold uppercase tracking-wider mb-2 w-full text-center bg-transparent outline-none border-none text-gray-800"
                  placeholder="YOUR NAME"
                />
                <input
                  type="text"
                  readOnly={!isEdit}
                  name="subtitle"
                  value={localResume.personalInfo?.subtitle}
                  onChange={(e) => handleChange(e, "personalInfo")}
                  className="text-xl text-gray-600 uppercase tracking-wide w-full text-center bg-transparent outline-none border-none"
                  placeholder="YOUR PROFESSION"
                />
              </motion.div>

              <div className="grid grid-cols-12 gap-8">
                <div className="col-span-4">
                  <Section title="ABOUT ME">
                    <textarea
                      readOnly={!isEdit}
                      name="description"
                      value={localResume.personalInfo?.description}
                      onChange={(e) => handleChange(e, "personalInfo")}
                      className="text-sm text-gray-600 w-full h-64 bg-transparent outline-none border-none resize-none"
                      placeholder="Write about yourself..."
                      rows="5"
                    />
                  </Section>

                  <Section title="CONTACT">
                    <AnimatePresence>
                      {localResume?.Contact?.map((contact, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.3 }}
                          className="mb-2 relative"
                        >
                          <input
                            type="text"
                            readOnly={!isEdit}
                            name="label"
                            value={contact.label}
                            onChange={(e) => handleChange(e, "Contact", index)}
                            className="text-sm font-semibold w-full bg-transparent outline-none border-none text-gray-700"
                            placeholder="Contact Label"
                          />
                          <input
                            type="text"
                            readOnly={!isEdit}
                            name="value"
                            value={contact.value}
                            onChange={(e) => handleChange(e, "Contact", index)}
                            className="text-sm text-gray-600 w-full bg-transparent outline-none border-none"
                            placeholder="Contact Value"
                          />
                          {isEdit && (
                            <motion.div
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => removeItem("Contact", index)}
                              className="absolute right-0 top-0 cursor-pointer"
                            >
                              <FaTrash className="text-sm text-gray-500" />
                            </motion.div>
                          )}
                        </motion.div>
                      ))}
                    </AnimatePresence>
                    {isEdit && (
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => addItem("Contact")}
                        className="cursor-pointer mt-2"
                      >
                        <FaPlus className="text-base text-gray-500" />
                      </motion.div>
                    )}
                  </Section>

                  <Section title="SKILLS">
                    <AnimatePresence>
                      {localResume?.Skills?.flatMap((skillGroup, groupIndex) =>
                        skillGroup.skills.map((skill, index) => (
                          <motion.div
                            key={`${groupIndex}-${index}`}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                            className="mb-2 relative"
                          >
                            <input
                              type="text"
                              readOnly={!isEdit}
                              name="name"
                              value={skill.name}
                              onChange={(e) =>
                                handleChange(e, "Skills", index, groupIndex)
                              }
                              className="text-sm font-semibold w-full bg-transparent outline-none border-none text-gray-700"
                              placeholder="Skill Name"
                            />
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${skill.level}%` }}
                                transition={{ duration: 0.5 }}
                                className="bg-gray-600 h-2 rounded-full"
                              />
                            </div>
                            {isEdit && (
                              <input
                                type="number"
                                name="level"
                                value={skill.level}
                                onChange={(e) =>
                                  handleChange(e, "Skills", index, groupIndex)
                                }
                                className="text-xs text-gray-600 w-16 mt-1 bg-transparent outline-none border-none"
                                placeholder="Skill Level"
                                min="0"
                                max="100"
                              />
                            )}
                            {isEdit && (
                              <motion.div
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() =>
                                  removeItem("Skills", index, groupIndex)
                                }
                                className="absolute right-0 top-0 cursor-pointer"
                              >
                                <FaTrash className="text-sm text-gray-500" />
                              </motion.div>
                            )}
                          </motion.div>
                        ))
                      )}
                    </AnimatePresence>
                    {isEdit && (
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => addItem("skills")}
                        className="cursor-pointer mt-2"
                      >
                        <FaPlus className="text-base text-gray-500" />
                      </motion.div>
                    )}
                  </Section>
                </div>

                <div className="col-span-8">
                  <Section title="EXPERIENCES">
                    <AnimatePresence>
                      {localResume?.Experience?.map((exp, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20}}
                          transition={{ duration: 0.3 }}
                          className="mb-4 relative"
                        >
                          <div className="flex justify-between items-baseline">
                            <input
                              type="text"
                              readOnly={!isEdit}
                              name="position"
                              value={exp.position}
                              onChange={(e) => handleChange(e, "Experience", index)}
                              className="text-lg font-semibold w-2/3 bg-transparent outline-none border-none text-gray-800"
                              placeholder="Position"
                            />
                            <input
                              type="text"
                              readOnly={!isEdit}
                              name="date"
                              value={exp.date}
                              onChange={(e) => handleChange(e, "Experience", index)}
                              className="text-sm text-gray-600 w-1/3 text-right bg-transparent outline-none border-none"
                              placeholder="Date"
                            />
                          </div>
                          <input
                            type="text"
                            readOnly={!isEdit}
                            name="company"
                            value={exp.company}
                            onChange={(e) => handleChange(e, "Experience", index)}
                            className="text-md font-medium w-full bg-transparent outline-none border-none text-gray-700"
                            placeholder="Company"
                          />
                          <textarea
                            readOnly={!isEdit}
                            name="description"
                            value={exp.description}
                            onChange={(e) => handleChange(e, "Experience", index)}
                            className="text-sm text-gray-600 mt-1 w-full bg-transparent outline-none border-none resize-none"
                            rows="3"
                            placeholder="Job Description"
                          />
                          {isEdit && (
                            <motion.div
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => removeItem("Experience", index)}
                              className="absolute right-0 bottom-0 cursor-pointer"
                            >
                              <FaTrash className="text-sm text-gray-500" />
                            </motion.div>
                          )}
                        </motion.div>
                      ))}
                    </AnimatePresence>
                    {isEdit && (
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => addItem("experience")}
                        className="cursor-pointer mt-2"
                      >
                        <FaPlus className="text-base text-gray-500" />
                      </motion.div>
                    )}
                  </Section>

                  <Section title="EDUCATION">
                    <AnimatePresence>
                      {localResume?.Education?.map((edu, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.3 }}
                          className="mb-4 relative"
                        >
                          <div className="flex justify-between items-baseline">
                            <input
                              type="text"
                              readOnly={!isEdit}
                              name="degree"
                              value={edu.degree}
                              onChange={(e) => handleChange(e, "Education", index)}
                              className="text-lg font-semibold w-2/3 bg-transparent outline-none border-none text-gray-800"
                              placeholder="Degree"
                            />
                            <input
                              type="text"
                              readOnly={!isEdit}
                              name="date"
                              value={edu.date}
                              onChange={(e) => handleChange(e, "Education", index)}
                              className="text-sm text-gray-600 w-1/3 text-right bg-transparent outline-none border-none"
                              placeholder="Date"
                            />
                          </div>
                          <input
                            type="text"
                            readOnly={!isEdit}
                            name="university"
                            value={edu.university}
                            onChange={(e) => handleChange(e, "Education", index)}
                            className="text-md w-full bg-transparent outline-none border-none text-gray-700"
                            placeholder="University"
                          />
                          {isEdit && (
                            <motion.div
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => removeItem("Education", index)}
                              className="absolute right-0 bottom-0 cursor-pointer"
                            >
                              <FaTrash className="text-sm text-gray-500" />
                            </motion.div>
                          )}
                        </motion.div>
                      ))}
                    </AnimatePresence>
                    {isEdit && (
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => addItem("education")}
                        className="cursor-pointer mt-2"
                      >
                        <FaPlus className="text-base text-gray-500" />
                      </motion.div>
                    )}
                  </Section>

                  <Section title="PROJECTS">
                    <AnimatePresence>
                      {localResume?.Projects?.map((project, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.3 }}
                          className="mb-4 relative"
                        >
                          <input
                            type="text"
                            readOnly={!isEdit}
                            name="name"
                            value={project.name}
                            onChange={(e) => handleChange(e, "Projects", index)}
                            className="text-lg font-semibold w-full bg-transparent outline-none border-none text-gray-800"
                            placeholder="Project Name"
                          />
                          <textarea
                            readOnly={!isEdit}
                            name="description"
                            value={project.description}
                            onChange={(e) => handleChange(e, "Projects", index)}
                            className="text-sm text-gray-600 mt-1 w-full h-auto bg-transparent outline-none border-none resize-none"
                            rows="4"
                            placeholder="Project Description"
                          />
                          <input
                            type="text"
                            readOnly={!isEdit}
                            name="link"
                            value={project.link}
                            onChange={(e) => handleChange(e, "Projects", index)}
                            className="text-sm text-blue-500 w-full bg-transparent outline-none border-none"
                            placeholder="Project Link"
                          />
                          {isEdit && (
                            <motion.div
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => removeItem("Projects", index)}
                              className="absolute right-0 bottom-0 cursor-pointer"
                            >
                              <FaTrash className="text-sm text-gray-500" />
                            </motion.div>
                          )}
                        </motion.div>
                      ))}
                    </AnimatePresence>
                    {isEdit && (
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => addItem("projects")}
                        className="cursor-pointer mt-2"
                      >
                        <FaPlus className="text-base text-gray-500" />
                      </motion.div>
                    )}
                  </Section>
                </div>
              </div>
            </div>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Section = ({ title, children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full mb-6"
    >
      <h2 className="text-xl font-bold text-gray-800 mb-2 pb-1 border-b-2 border-gray-300">
        {title}
      </h2>
      {children}
    </motion.div>
  );
};

export default Resume;