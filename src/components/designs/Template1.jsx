import React from "react";
import LeftSidebar from "./components/LeftSidebar";
import ResumeSection from "./components/ResumeSection";
import RightSidebar from "./components/RightSidebar";
import { useResume } from "../../hooks/useResume";
import { FaHouse } from "react-icons/fa6";
import { BiSolidBookmarks } from "react-icons/bi";
import { BsFiletypePdf } from "react-icons/bs";
import { Link, useNavigate } from "react-router-dom";

function Template1() {
  const { resume, updateResumeData, saveResume, generatePDF } = useResume();
  const navigate = useNavigate();

  return (
    <>
    {/* bread crumb */}
    <div className="w-full flex items-center pb-8 gap-2">
      <Link to="/" className="flex items-center justify-center gap-2 text-txtPrimary">
        <FaHouse /> Home
      </Link>
      <p>/</p>
      <button
        onClick={() => navigate(-1)}
        className="text-txtPrimary"
      >
        Template1
      </button>
      <p>/</p>
      <p>Edit</p>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-12 h-screen bg-gray-100 gap-4 mx-auto">
      <div className="col-span-1 lg:col-span-4">
        <LeftSidebar resume={resume} updateResumeData={updateResumeData} />
      </div>

      <div className="col-span-1 md:col-span-2 lg:col-span-8 flex flex-col">
        <div className="flex justify-end p-4">
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
        </div>
          <ResumeSection resume={resume} updateResumeData={updateResumeData} />
      </div>

      {/* <div className="col-span-1 lg:col-span-3">
        <RightSidebar updateResumeData={updateResumeData} />
      </div> */}
    </div>
    </>
  );
}

export default Template1;
