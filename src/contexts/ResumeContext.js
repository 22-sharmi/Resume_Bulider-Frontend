import React, { createContext, useContext, useState } from 'react';

const ResumeContext = createContext();

export const ResumeProvider = ({ children }) => {
    const [resumeData, setResumeData] = useState({
        title: "Name Here",
        subtitle: "Software Developer",
        description: "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Pariatur illo qui deserunt vero repellat temporibus mollitia, sint eum praesentium voluptatem reprehenderit earum ullam nemo! Molestiae corrupti blanditiis ex iusto minus.",
        image: "../images/profile.jpg",
        Education: [
          { date: "2024-2025", degree: "B.Tech", university: "University Name" },
          { date: "2024-2025", degree: "B.Tech", university: "University Name" },
        ],
        Contact: [
          { label: "Phone", value: "+91 1234567890" },
          { label: "Email", value: "abcd@example.com" },
        ],
        Skills: [
          {
            category: "Frontend Developer",
            skills: "html, css, js, react.js, tailwind css",
          },
          {
            category: "Backend Developer",
            skills: "Nodejs, Express.js, MongoDB, Appwrite",
          },
        ],
        Experience: [
          {
            date: "2020-present",
            company: "Company Name",
            position: "Frontend Developer",
            description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolores, beatae.",
          },
          {
            date: "2020-present",
            company: "Company Name",
            position: "Frontend Developer",
            description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolores, beatae.",
          },
          {
            date: "2020-present",
            company: "Company Name",
            position: "Frontend Developer",
            description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolores, beatae.",
          },
        ],
        Projects: [
          {
            name: "E-commerce website",
            description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolores, beatae.",
            link: "https://e-commerce-ready-apy.vercel.app",
          },
          {
            name: "Whiteboard editor",
            description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolores, beatae.",
            link: "https://e-commerce-ready-apy.vercel.app",
          },
          {
            name: "Blog website",
            description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolores, beatae.",
            link: "https://e-commerce-ready-apy.vercel.app",
          },
        ],
      });
  const [selectedElement, setSelectedElement] = useState(null);
  const [selectedTemplateId, setSelectedTemplateId] = useState(1);

  const updateResumeData = (section, index, key, value) => {
    setResumeData(prevData => {
      const newData = { ...prevData };
      if (Array.isArray(newData[section])) {
        newData[section][index][key] = value;
      } else {
        newData[section] = value;
      }
      return newData;
    });
  };

  return (
    <ResumeContext.Provider value={{
      resumeData,
      updateResumeData,
      selectedElement,
      setSelectedElement,
      selectedTemplateId,
      setSelectedTemplateId
    }}>
      {children}
    </ResumeContext.Provider>
  );
};

export const useResumeContext = () => useContext(ResumeContext);