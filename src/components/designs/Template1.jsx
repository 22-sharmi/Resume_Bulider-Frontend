import React from "react";
import LeftSidebar from "./components/LeftSidebar";
import ResumeSection from "./components/ResumeSection";
import RightSidebar from "./components/RightSidebar";
import { useResume } from "../../hooks/useResume";
import { FaHouse } from "react-icons/fa6";
import { BsFiletypePdf } from "react-icons/bs";
import { Link, useNavigate } from "react-router-dom";
import Resume from "../Template";
import { AiFillWarning } from "react-icons/ai";
import ResumeMobile from "./components/ResumeMobile";

function Template1() {
  const {
    resume,
    isLoading,
    error,
    updateResumeData,
    saveResume,
    generatePDF,
  } = useResume();
  const navigate = useNavigate();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading resume: {error.message}</div>;

  return (
    <>
      {/* bread crumb */}
      <div className="w-full flex items-center pb-8 gap-2">
        <Link
          to="/"
          className="flex items-center justify-center gap-2 text-txtPrimary"
        >
          <FaHouse /> Home
        </Link>
        <p>/</p>
        <button onClick={() => navigate(-1)} className="text-txtPrimary">
          Template1
        </button>
        <p>/</p>
        <p>Edit</p>
      </div>

      {/* <div className=""> */}
      <div className="md:block hidden">
            <Resume resume={resume} updateResumeData={updateResumeData} />
          </div>
          <div className="block md:hidden">
          <ResumeMobile resume={resume} updateResumeData={updateResumeData} />
          </div>
          {/* <div className="flex flex-col justify-center items-center gap-4 border border-dotted border-yellow-500 mx-7 md:hidden p-4 bg-yellow-50 rounded-lg shadow-lg">
      <div className="flex items-center gap-3">
        <AiFillWarning className="text-yellow-600 text-2xl" />
        <p className="text-yellow-800 font-semibold text-lg">Editing Notice</p>
      </div>
      <p className="text-center text-yellow-700">
        Please use a laptop to edit the template for a better experience.
      </p>
      <ul className="list-disc list-inside text-yellow-700">
        <li>Detailed resume layout customization</li>
        <li>Real-time text styling and formatting</li>
        <li>Responsive preview across different devices</li>
        <li>Interactive editing features and controls</li>
        <li>Seamless PDF download and save options</li>
      </ul>
      <div className="flex justify-center">
      </div>
      <p className="text-justify text-yellow-700 mt-1">
        We are creating a responsive template for mobile screens. Please be patient, the mobile-friendly version will be available soon.
      </p>
    </div> */}

      {/* <div className="grid grid-cols-1 lg:grid-cols-12 h-screen bg-gray-100 gap-4 mx-auto"> */}
        {/* <div className="col-span-1 lg:col-span-4">
        <LeftSidebar resume={resume} updateResumeData={updateResumeData} />
      </div> */}

        {/* <div className="col-span-1 md:col-span-2 lg:col-span-8 flex flex-col mx-auto"> */}
          {/* <div className="flex justify-end gap-3 p-4 mr-20">
          <button
            onClick={saveResume}
            className="border flex items-center gap-2 border-gray-500 text-txtDark px-4 py-2  hover:text-white hover:bg-gray-500 rounded-md"
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
        </div> */}
          {/* <ResumeSection resume={resume} updateResumeData={updateResumeData} /> */}
        {/* </div> */}

        {/* <div className="col-span-1 lg:col-span-3">
        <RightSidebar updateResumeData={updateResumeData} />
      </div> */}
      {/* </div> */}
    </>
  );
}

export default Template1;
