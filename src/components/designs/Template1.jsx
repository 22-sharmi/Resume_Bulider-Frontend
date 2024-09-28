import React from "react";
// import LeftSidebar from "./components/LeftSidebar";
// import ResumeSection from "./components/ResumeSection";
// import RightSidebar from "./components/RightSidebar";
import { useResume } from "../../hooks/useResume";
import { FaHouse } from "react-icons/fa6";
// import { BsFiletypePdf } from "react-icons/bs";
import { Link, useNavigate } from "react-router-dom";
import Resume from "../Resume1";
// import { AiFillWarning } from "react-icons/ai";
// import ResumeMobile from "./components/ResumeMobile1";
// import Resume1 from "./components/Resume1";
import ResumeMobile1 from "./components/ResumeMobile1";

function Template1() {
  const {
    resume,
    isLoading,
    error,
    updateResumeData,
    // saveResume,
    // generatePDF,
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
          <ResumeMobile1 resume={resume} updateResumeData={updateResumeData} />
          </div>
    </>
  );
}

export default Template1;
