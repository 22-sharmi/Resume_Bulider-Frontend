import React from 'react';
import Accordion from './Accordion';
import { AiOutlinePlus, AiOutlineMinus } from 'react-icons/ai';

function LeftSidebar({ resume, updateResumeData }) {

  const handleInputChange = (e, section, index = null, skillIndex = null, skillField = null) => {
    if (!resume) return;
    const { name, value } = e.target;
    let updatedSection;

    if (section === 'Skills' && skillIndex !== null) {
      updatedSection = [...resume[section]];
      updatedSection[index].skills[skillIndex][skillField] = value;
    } else if (index !== null) {
      updatedSection = [...resume[section]];
      updatedSection[index] = { ...updatedSection[index], [name]: value };
    } else {
      updatedSection = { ...resume[section], [name]: value };
    }

    updateResumeData({ ...resume, [section]: updatedSection });
  };

  const addItem = (section, index = null) => {
    if (section === 'Skills' && index !== null) {
      const updatedSkills = [...resume.Skills];
      updatedSkills[index].skills = [...updatedSkills[index].skills, { name: '', level: '' }];
      updateResumeData({ ...resume, Skills: updatedSkills });
    } else {
      const newItem = section === 'Education' ? { date: '', degree: '', university: '' } :
                      section === 'Skills' ? { category: '', skills: [{ name: '', level: '' }] } :
                      section === 'Experience' ? { date: '', company: '', position: '', description: '' } :
                      section === 'Projects' ? { name: '', description: '', link: '' } :
                      section === 'Contact' ? { label: '', value: '' } : {};

      updateResumeData({ ...resume, [section]: [...resume[section], newItem] });
    }
  };

  const removeItem = (section, index, skillIndex = null) => {
    let updatedSection;
    if (section === 'Skills' && skillIndex !== null) {
      updatedSection = [...resume[section]];
      updatedSection[index].skills.splice(skillIndex, 1);
    } else {
      updatedSection = [...resume[section]];
      updatedSection.splice(index, 1);
    }
    updateResumeData({ ...resume, [section]: updatedSection });
  };

  return (
    <div className="w-full mx-auto p-4 overflow-y-auto">
      <Accordion title="Personal Info">
        <input
          type="text"
          name="title"
          value={resume?.personalInfo?.title || ''}
          onChange={(e) => handleInputChange(e, 'personalInfo')}
          className="w-full p-2 border rounded mb-2"
          placeholder="Name"
        />
        <input
          type="text"
          name="subtitle"
          value={resume?.personalInfo?.subtitle || ''}
          onChange={(e) => handleInputChange(e, 'personalInfo')}
          className="w-full p-2 border rounded mb-2"
          placeholder="Job Title"
        />
        <textarea
          name="description"
          value={resume?.personalInfo?.description || ''}
          onChange={(e) => handleInputChange(e, 'personalInfo')}
          className="w-full p-2 border rounded mb-2"
          placeholder="Description"
          rows="4"
        />
      </Accordion>

      <Accordion title="Education">
        {resume?.Education?.map((edu, index) => (
          <div key={index} className="mb-2 border p-2 rounded">
            <div className="flex justify-between items-center mb-1">
              <input
                type="text"
                name="date"
                value={edu.date || ''}
                onChange={(e) => handleInputChange(e, 'Education', index)}
                className="w-full p-2 border rounded mb-1"
                placeholder="Date"
              />
              <button
                onClick={() => removeItem('Education', index)}
                className="bg-red-500 text-white p-1 rounded ml-2"
              >
                <AiOutlineMinus />
              </button>
            </div>
            <input
              type="text"
              name="degree"
              value={edu.degree || ''}
              onChange={(e) => handleInputChange(e, 'Education', index)}
              className="w-full p-2 border rounded mb-1"
              placeholder="Degree"
            />
            <input
              type="text"
              name="university"
              value={edu.university || ''}
              onChange={(e) => handleInputChange(e, 'Education', index)}
              className="w-full p-2 border rounded mb-1"
              placeholder="University"
            />
          </div>
        ))}
        <button onClick={() => addItem('Education')} className="w-full bg-blue-500 text-white p-2 rounded flex justify-center items-center">
          <AiOutlinePlus className="mr-2" /> Add Education
        </button>
      </Accordion>

      <Accordion title="Contact">
        {resume?.Contact?.map((contact, index) => (
          <div key={index} className="mb-2 border p-2 rounded">
            <div className="flex justify-between items-center mb-1">
              <input
                type="text"
                name="label"
                value={contact.label || ''}
                onChange={(e) => handleInputChange(e, 'Contact', index)}
                className="w-full p-2 border rounded mb-1"
                placeholder="Label"
              />
              <button
                onClick={() => removeItem('Contact', index)}
                className="bg-red-500 text-white p-1 rounded ml-2"
              >
                <AiOutlineMinus />
              </button>
            </div>
            <input
              type="text"
              name="value"
              value={contact.value || ''}
              onChange={(e) => handleInputChange(e, 'Contact', index)}
              className="w-full p-2 border rounded mb-1"
              placeholder="Value"
            />
          </div>
        ))}
        <button onClick={() => addItem('Contact')} className="w-full bg-blue-500 text-white p-2 rounded flex justify-center items-center">
          <AiOutlinePlus className="mr-2" /> Add Contact
        </button>
      </Accordion>

      <Accordion title="Skills">
        {resume?.Skills?.map((skill, index) => (
          <div key={index} className="mb-2 border p-2 rounded">
            <div className="flex justify-between items-center mb-1">
              <input
                type="text"
                name="category"
                value={skill.category || ''}
                onChange={(e) => handleInputChange(e, 'Skills', index)}
                className="w-full p-2 border rounded mb-1"
                placeholder="Category"
              />
              <button
                onClick={() => removeItem('Skills', index)}
                className="bg-red-500 text-white p-1 rounded ml-2"
              >
                <AiOutlineMinus />
              </button>
            </div>
            {skill.skills.map((skillItem, skillIndex) => (
              <div key={skillIndex} className="mb-1 flex items-center">
                <input
                  type="text"
                  name="skills"
                  value={skillItem.name || ''}
                  onChange={(e) => handleInputChange(e, 'Skills', index, skillIndex, 'name')}
                  className="w-full p-2 border rounded mr-2"
                  placeholder="Skill"
                />
                <input
                  type="text"
                  name="level"
                  value={skillItem.level || ''}
                  onChange={(e) => handleInputChange(e, 'Skills', index, skillIndex, 'level')}
                  className="w-full p-2 border rounded mr-2"
                  placeholder="Level (%)"
                />
                <button
                  onClick={() => removeItem('Skills', index, skillIndex)}
                  className="text-red-500 p-1 rounded"
                >
                  <AiOutlineMinus />
                </button>
              </div>
            ))}
            <button
              onClick={() => addItem('Skills', index)}
              className="w-full bg-green-500 text-white p-1 rounded flex justify-center items-center mt-2"
            >
              <AiOutlinePlus className="mr-2" /> Add Skill
            </button>
          </div>
        ))}
        <button onClick={() => addItem('Skills')} className="w-full bg-blue-500 text-white p-2 rounded flex justify-center items-center">
          <AiOutlinePlus className="mr-2" /> Add Category
        </button>
      </Accordion>

      <Accordion title="Experience">
        {resume?.Experience?.map((exp, index) => (
          <div key={index} className="mb-2 border p-2 rounded">
            <div className="flex justify-between items-center mb-1">
              <input
                type="text"
                name="date"
                value={exp.date || ''}
                onChange={(e) => handleInputChange(e, 'Experience', index)}
                className="w-full p-2 border rounded mb-1"
                placeholder="Date"
              />
              <button
                onClick={() => removeItem('Experience', index)}
                className="bg-red-500 text-white p-1 rounded ml-2"
              >
                <AiOutlineMinus />
              </button>
            </div>
            <input
              type="text"
              name="company"
              value={exp.company || ''}
              onChange={(e) => handleInputChange(e, 'Experience', index)}
              className="w-full p-2 border rounded mb-1"
              placeholder="Company"
            />
            <input
              type="text"
              name="position"
              value={exp.position || ''}
              onChange={(e) => handleInputChange(e, 'Experience', index)}
              className="w-full p-2 border rounded mb-1"
              placeholder="Position"
            />
            <textarea
              name="description"
              value={exp.description || ''}
              onChange={(e) => handleInputChange(e, 'Experience', index)}
              className="w-full p-2 border rounded mb-1"
              placeholder="Description"
              rows="3"
            />
          </div>
        ))}
        <button onClick={() => addItem('Experience')} className="w-full bg-blue-500 text-white p-2 rounded flex justify-center items-center">
          <AiOutlinePlus className="mr-2" /> Add Experience
        </button>
      </Accordion>

      <Accordion title="Projects">
        {resume?.Projects?.map((project, index) => (
          <div key={index} className="mb-2 border p-2 rounded">
            <div className="flex justify-between items-center mb-1">
              <input
                type="text"
                name="name"
                value={project.name || ''}
                onChange={(e) => handleInputChange(e, 'Projects', index)}
                className="w-full p-2 border rounded mb-1"
                placeholder="Name"
              />
              <button
                onClick={() => removeItem('Projects', index)}
                className="bg-red-500 text-white p-1 rounded ml-2"
              >
                <AiOutlineMinus />
              </button>
            </div>
            <textarea
              name="description"
              value={project.description || ''}
              onChange={(e) => handleInputChange(e, 'Projects', index)}
              className="w-full p-2 border rounded mb-1"
              placeholder="Description"
              rows="3"
            />
            <input
              type="text"
              name="link"
              value={project.link || ''}
              onChange={(e) => handleInputChange(e, 'Projects', index)}
              className="w-full p-2 border rounded mb-1"
              placeholder="Link"
            />
          </div>
        ))}
        <button onClick={() => addItem('Projects')} className="w-full bg-blue-500 text-white p-2 rounded flex justify-center items-center">
          <AiOutlinePlus className="mr-2" /> Add Project
        </button>
      </Accordion>
    </div>
  );
}

export default LeftSidebar;
