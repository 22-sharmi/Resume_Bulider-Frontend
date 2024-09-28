import React, { useCallback, useRef, useState } from "react";
import { FaTrash, FaPlus, FaPenToSquare, FaPencil } from "react-icons/fa6";
import { motion, AnimatePresence } from "framer-motion";
import { TemplateOne } from "../assets";
import { MainSpinner } from ".";
import { BiSolidBookmarks } from "react-icons/bi";
import { BsFiletypePdf } from "react-icons/bs";
import { useResume } from "../hooks/useResume";
import axios from "axios";
import { toast } from "react-toastify";
import StyleControls from "../utils/StyleControls";

const Resume2 = ({ resume, updateResumeData }) => {
  const [isEdit, setIsEdit] = useState(false);
  const [localResume, setLocalResume] = useState(resume);
  const { generatePDF } = useResume();
  const fileInputRef = useRef(null);
  const [imageURL, setImageURL] = useState(
    resume?.personalInfo?.photo || TemplateOne
  );

  const [styles, setStyles] = useState({
    fontFamily: "Arial",
    fontSize: "14px",
    fontWeight: "400",
    textAlign: "left",
    textColor: "#ffffff",
    leftSideBackgroundColor: "#000000",
    headerBackgroundColor: "#e5e7eb",
  });

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

  const handleChange = (e, section, skillIndex, skillGroupIndex = 0) => {
    const { name, value } = e.target;
    const updatedResume = { ...localResume };
    if (section === "Skills") {
      updatedResume[section][skillGroupIndex].skills[skillIndex] = {
        ...updatedResume[section][skillGroupIndex].skills[skillIndex],
        [name]: value,
      };
    } else if (skillIndex !== undefined) {
      updatedResume[section][skillIndex] = {
        ...updatedResume[section][skillIndex],
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

  const removeItem = (section, skillIndex, skillGroupIndex = 0) => {
    const updatedResume = { ...localResume };
    const sectionKey = section.charAt(0).toUpperCase() + section.slice(1);

    if (section === "Skills") {
      if (updatedResume[sectionKey][skillGroupIndex]?.skills) {
        updatedResume[sectionKey][skillGroupIndex].skills = updatedResume[
          sectionKey
        ][skillGroupIndex].skills.filter((_, i) => i !== skillIndex);
        if (updatedResume[sectionKey][skillGroupIndex].skills.length === 0) {
          updatedResume[sectionKey] = updatedResume[sectionKey].filter(
            (_, i) => i !== skillGroupIndex
          );
        }
      }
    } else {
      updatedResume[sectionKey] = updatedResume[sectionKey].filter(
        (_, i) => i !== skillIndex
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
      default:
        return {};
    }
  };

  const saveChanges = () => {
    updateResumeData(localResume);
  };

  return (
    <div className="w-full flex flex-col items-center justify-start gap-4">
      <StyleControls styles={styles} setStyles={setStyles} />
      <div className="w-full lg:w-[1000px] grid grid-cols-12 px-6 lg:px-32">
        <div className="col-span-12 px-4 py-6">
          <div className="flex items-center justify-end w-full gap-12 mb-4">
            <div
              className="border flex items-center gap-2 border-gray-500 text-txtDark px-4 py-2  hover:text-white hover:bg-gray-500 rounded-md"
              onClick={toggleEditable}
            >
              {isEdit ? (
                <FaPenToSquare className="text-sm " />
              ) : (
                <FaPencil className="text-sm " />
              )}
              <p className="text-sm ">Edit</p>
            </div>
            <button
              className="border flex items-center gap-2 border-gray-500 text-txtDark px-4 py-2  hover:text-white hover:bg-gray-500 rounded-md"
              onClick={saveChanges}
            >
              <BiSolidBookmarks className="text-sm" />
              Save
            </button>
            <button
              onClick={generatePDF}
              className="border flex items-center gap-2 border-gray-500 text-txtDark px-4 py-2  hover:text-white hover:bg-gray-500 rounded-md"
            >
              <BsFiletypePdf className="text-2xl cursor-pointer" />
              Download PDF
            </button>
          </div>
          <div
            className="w-full h-auto grid grid-cols-12"
            id="resume-content"
            style={{
              fontFamily: styles.fontFamily,
              fontSize: styles.fontSize,
              fontWeight: styles.fontWeight,
              textAlign: styles.textAlign,
            }}
          >
            <div
              className="col-span-4 flex flex-col items-center justify-start"            >
                <div className="w-full flex flex-col items-center justify-start gap-6 text-white"  style={{
                backgroundColor: styles.leftSideBackgroundColor,
                color: styles.textColor,
              }}>
                <div className="relative w-full h-80 flex items-center justify-center mb-8">
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
                <div
                  className="absolute px-3 py-2 bg-yellow-500"
                  style={{
                    bottom: "-17px",
                  }}
                >
                  <input
                    value={localResume.personalInfo?.subtitle}
                    onChange={(e) => handleChange(e, "personalInfo")}
                    name="subtitle"
                    type="text"
                    readOnly={!isEdit}
                    className={`bg-transparent outline-none border-none text-xs uppercase text-txtPrimary w-full ${
                      isEdit ? "text-white" : ""
                    }`}
                  />
                </div>
              </div>
              <div className="pl-4 mt-4"><Section title="EDUCATION">
                  <AnimatePresence>
                    {localResume?.Education?.map((edu, index) => (
                      <motion.div key={index} className="w-full mt-3 relative">
                        <input
                          type="text"
                          readOnly={!isEdit}
                          name="degree"
                          value={edu.degree}
                          onChange={(e) => handleChange(e, "Education", index)}
                          className={`bg-transparent outline-none border-none text-sm font-semibold uppercase text-gray-100 ${
                            isEdit && "text-yellow-400 w-full"
                          }`}
                        />
                        <textarea
                          readOnly={!isEdit}
                          className={`text-xs text-gray-200 mt-2 w-full h-auto outline-none resize-none border-none ${
                            isEdit ? "bg-[#1c1c1c]" : "bg-transparent"
                          }`}
                          name="university"
                          value={edu.university}
                          onChange={(e) => handleChange(e, "Education", index)}
                          rows="1"
                        />
                        <input
                          type="text"
                          readOnly={!isEdit}
                          name="date"
                          value={edu.date}
                          onChange={(e) => handleChange(e, "Education", index)}
                          className={`text-xs text-gray-200 w-full outline-none border-none ${
                            isEdit ? "bg-[#1c1c1c]" : "bg-transparent"
                          }`}
                        />
                        {isEdit && (
                          <motion.div
                            onClick={() => removeItem("Education", index)}
                            className="cursor-pointer absolute right-2 top-0"
                          >
                            <FaTrash className="text-sm text-gray-100" />
                          </motion.div>
                        )}
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  {isEdit && (
                    <motion.div
                      onClick={() => addItem("education")}
                      className="cursor-pointer"
                    >
                      <FaPlus className="text-base text-gray-100" />
                    </motion.div>
                  )}
                </Section></div>
                
                </div>

              <div className="w-full flex flex-col items-center justify-start pl-4 mt-4 gap-6">
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
                            className="mb-4 relative"
                          ><div className="flex justify-start">
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
                            <div className="w-full bg-gray-500 rounded-full h-1">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${skill.level}%` }}
                                transition={{ duration: 0.5 }}
                                className="bg-yellow-500 h-1 rounded-full"
                              />
                            </div>
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
                                className="absolute right-0 bottom-0 cursor-pointer"
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

                <Section title="CONTACT">
                  <AnimatePresence>
                    {localResume?.Contact?.map((contact, index) => (
                      <motion.div
                        key={index}
                        className="w-full mt-3 relative"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        transition={{ duration: 0.3 }}
                      >
                        <input
                          type="text"
                          readOnly={!isEdit}
                          name="label"
                          value={contact.label}
                          onChange={(e) => handleChange(e, "Contact", index)}
                          className={`bg-transparent outline-none text-sm font-semibold uppercase ${
                            isEdit && "text-yellow-400 w-full"
                          }`}
                        />
                        <input
                          type="text"
                          readOnly={!isEdit}
                          name="value"
                          value={contact.value}
                          onChange={(e) => handleChange(e, "Contact", index)}
                          className={`text-xs mt-2 w-full outline-none border-none ${
                            isEdit ? "bg-[#b0a1a1]" : "bg-transparent"
                          }`}
                        />
                        {isEdit && (
                          <motion.div
                            onClick={() => removeItem("Contact", index)}
                            className="cursor-pointer absolute right-2 top-0"
                          >
                            <FaTrash className="text-sm text-gray-500" />
                          </motion.div>
                        )}
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  {isEdit && (
                    <motion.div
                      onClick={() => addItem("Contact")}
                      className="cursor-pointer mt-3"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <FaPlus className="text-base text-gray-800" />
                    </motion.div>
                  )}
                </Section>
              </div>
            </div>
            <div className="col-span-8 flex flex-col items-center justify-start">
              <div
                className="w-full px-4 py-2"
                style={{ backgroundColor: styles.headerBackgroundColor }}
              >
                <input
                  type="text"
                  readOnly={!isEdit}
                  name="title"
                  value={localResume.personalInfo?.title}
                  onChange={(e) => handleChange(e, "personalInfo")}
                  className={`bg-transparent outline-none border-none text-3xl font-sans uppercase tracking-wider text-txtDark font-extrabold ${
                    isEdit && "text-txtPrimary w-full"
                  }`}
                />
                <input
                  value={localResume.personalInfo?.subtitle}
                  onChange={(e) => handleChange(e, "personalInfo")}
                  name="subtitle"
                  type="text"
                  readOnly={!isEdit}
                  className={`bg-transparent outline-none border-none text-xl tracking-widest uppercase text-txtPrimary mt-1 w-full ${
                    isEdit && "text-txtPrimary"
                  }`}
                />
                <div className="mt-4 h-auto"><Section title="PROFILE">
                  <textarea
                    readOnly={!isEdit}
                    className={`text-base text-txtPrimary tracking-wider w-full outline-none border-none  ${
                      isEdit ? "bg-gray-200" : "bg-transparent"
                    }`}
                    name="description"
                    value={localResume.personalInfo?.description}
                    onChange={(e) => handleChange(e, "personalInfo")}
                    rows="5"
                    style={{
                      minHeight: "100px",
                      width: "100%",
                      height: "100%",
                      resize: "none",
                    }}
                  />
                </Section></div>
                 
              </div>

              <div className="w-full px-4 py-6 flex flex-col items-start justify-start gap-6">

                <Section title="WORK EXPERIENCE">
                  <AnimatePresence>
                    {localResume?.Experience?.map((exp, index) => (
                      <motion.div
                        key={index}
                        className="w-full flex flex-col relative"
                      >
                        <div className="">
                          <input
                            value={exp.position}
                            onChange={(e) =>
                              handleChange(e, "Experience", index)
                            }
                            name="position"
                            type="text"
                            readOnly={!isEdit}
                            className={`outline-none border-none font-sans text-lg tracking-wide capitalize text-txtDark w-full ${
                              isEdit ? "bg-gray-200" : "bg-transparent"
                            }`}
                          />
                        </div>
                        <div className="flex justify-start"> 
                        <input
                            value={exp.date}
                            onChange={(e) =>
                              handleChange(e, "Experience", index)
                            }
                            name="date"
                            type="text"
                            readOnly={!isEdit}
                            className={`outline-none border-none text-base tracking-wide uppercase text-txtDark w-1/4 ${
                              isEdit ? "bg-gray-200" : "bg-transparent"
                            }`}
                          />
                          <input
                            value={exp.company}
                            onChange={(e) =>
                              handleChange(e, "Experience", index)
                            }
                            name="company"
                            type="text"
                            readOnly={!isEdit}
                            className={`outline-none border-none text-sm tracking-wide capitalize text-txtPrimary w-full ${
                              isEdit ? "bg-gray-200" : "bg-transparent"
                            }`}
                          />
                        </div>
                        <div>
                        <textarea
                            readOnly={!isEdit}
                            className={`text-xs mt-4 text-txtPrimary tracking-wider w-full outline-none border-none ${
                              isEdit ? "bg-gray-200" : "bg-transparent"
                            }`}
                            name="description"
                            value={exp.description}
                            onChange={(e) =>
                              handleChange(e, "Experience", index)
                            }
                            rows="3"
                            style={{
                              // maxHeight: "auto",
                              height: "100%",
                              minHeight: "60px",
                              resize: "none",
                            }}
                          />
                        </div>
                        {isEdit && (
                          <motion.div
                            onClick={() => removeItem("Experience", index)}
                            className="cursor-pointer absolute right-2 top-0"
                          >
                            <FaTrash className="text-sm text-gray-900" />
                          </motion.div>
                        )}
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  {isEdit && (
                    <motion.div
                      onClick={() => addItem("experience")}
                      className="cursor-pointer"
                    >
                      <FaPlus className="text-base text-txtPrimary" />
                    </motion.div>
                  )}
                </Section>

                <Section title="PROJECTS">
                  <AnimatePresence>
                    {localResume?.Projects?.map((project, index) => (
                      <motion.div
                        key={index}
                        className="w-full mt-3 relative"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        transition={{ duration: 0.3 }}
                      >
                        <input
                          type="text"
                          readOnly={!isEdit}
                          name="name"
                          value={project.name}
                          onChange={(e) => handleChange(e, "Projects", index)}
                          className={`w-full bg-transparent outline-none border-none text-sm font-semibold uppercase text-txtPrimary ${
                            isEdit && "text-yellow-400"
                          }`}
                          placeholder="Project Name"
                        />
                        <textarea
                          readOnly={!isEdit}
                          className={`text-xs mt-2 w-full outline-none border-none ${
                            isEdit ? "bg-gray-200" : "bg-transparent"
                          }`}
                          name="description"
                          value={project.description}
                          onChange={(e) => handleChange(e, "Projects", index)}
                          rows="4"
                          placeholder="Project Description"
                          style={{
                            height: "100%",
                            minHeight: "30px",
                            resize: "none",
                          }}
                        />
                        <input
                          type="text"
                          readOnly={!isEdit}
                          name="link"
                          value={project.link}
                          onChange={(e) => handleChange(e, "Projects", index)}
                          className={`text-xs w-full outline-none border-none  ${
                            isEdit ? "bg-gray-200" : "bg-transparent"
                          }`}
                          placeholder="Project Link"
                        />
                        {isEdit && (
                          <motion.div
                            onClick={() => removeItem("Projects", index)}
                            className="cursor-pointer absolute right-2 top-0"
                          >
                            <FaTrash className="text-sm text-gray-900" />
                          </motion.div>
                        )}
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  {isEdit && (
                    <motion.div
                      onClick={() => addItem("Projects")}
                      className="cursor-pointer mt-3"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <FaPlus className="text-base text-txt-Primary" />
                    </motion.div>
                  )}
                </Section>
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
    <div className="w-full mb-6">
      <p className="uppercase text-xl tracking-wider font-semibold mb-2 border-b border-yellow-300 pb-1">
        {title}
      </p>
      {children}
    </div>
  );
};

export default Resume2;
