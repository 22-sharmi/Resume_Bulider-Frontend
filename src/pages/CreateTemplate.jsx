import React, { useState, useEffect, useContext } from "react";
import { FaTrash, FaUpload } from "react-icons/fa6";
import { PuffLoader } from "react-spinners";
import { toast } from "react-toastify";
import axios from "axios";
import { adminIds, initialTags } from "../utils/helpers";
import useTemplates from "../hooks/useTemplates";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const CreateTemplate = () => {
  const [formData, setFormData] = useState({
    title: "",
    imageURL: null,
  });

  const [imageAssets, setImageAssets] = useState({
    url: null,
    isImageLoading: false,
    progress: 0,
  });

  const [selectedTags, setSelectedTags] = useState([]);

  const {
    data: templates,
    isLoading: templatesIsLoading,
    isError: templatesIsError,
    refetch: templatesRefetch,
  } = useTemplates();

  const { user, isLoading } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !adminIds.includes(user?._id)) {
      toast.error("You are not authorized to create templates");
      navigate("/", { replace: true });
    }
  }, [isLoading, navigate, user]);

  // Handling the input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevRec) => ({ ...prevRec, [name]: value }));
  };

  // Handling the image change
  const handleFileSelect = async (e) => {
    setImageAssets((prevAsset) => ({ ...prevAsset, isImageLoading: true }));
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
        setImageAssets((prevAsset) => ({
          ...prevAsset,
          url: `http://localhost:5555${response.data.url}`,
          // url: `http://localhost:5555/api/images/${response.data.url}`,
        }));
        toast.success("Image uploaded!");
      } catch (error) {
        toast.error(`Error: ${error.message}`);
      } finally {
        setImageAssets((prevAsset) => ({
          ...prevAsset,
          isImageLoading: false,
        }));
      }
    } else {
      toast.info("Invalid File Format");
    }
  };

  // Action to delete an image from the cloud
  const deleteAnImageObject = async () => {
    try {
      await axios.delete(`http://localhost:5555/api/delete-image`, {
        data: { url: imageAssets.url },
      });
      setImageAssets((prevAsset) => ({
        ...prevAsset,
        progress: 0,
        url: null,
      }));
      toast.success("Image Removed!");
    } catch (error) {
      toast.error(`Error: ${error.message}`);
    }
  };

  const isAllowed = (file) => {
    const allowedTypes = ["image/jpg", "image/jpeg", "image/png"];
    return allowedTypes.includes(file.type);
  };

  const handleSelectTags = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((selected) => selected !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const pushToCloud = async () => {
    const _doc = {
      title: formData.title,
      imageURL: imageAssets.url,
      tags: selectedTags,
      name:
        templates && templates.length > 0
          ? `template${templates.length + 1}`
          : "template1",
    };

    try {
      await axios.post("http://localhost:5555/api/templates", _doc);
      setFormData({ title: "", imageURL: "" });
      setImageAssets({ url: null });
      setSelectedTags([]);
      templatesRefetch();
      toast.success("Data Pushed To Cloud");
    } catch (err) {
      toast.error(`Error: ${err.message}`);
    }
  };

  // Function to remove the data from the cloud
  const removeTemplate = async (template) => {
    try {
      // Delete the image associated with the template
      await axios.delete(`http://localhost:5555/api/delete-image`, {
        data: { url: template.imageURL },
      });

      // Now delete the template
      await axios.delete(`http://localhost:5555/api/templates/${template._id}`);
      templatesRefetch();
      toast.success("Template and Image Removed From Cloud");
    } catch (err) {
      toast.error(`Error : ${err.message}`);
    }
  };

  return (
    <div className="w-full px-4 lg:px-10 2xl:px-32 py-4 grid grid-cols-1 lg:grid-cols-12">
      {/* Left Container */}
      <div className="col-span-12 lg:col-span-4 2xl:col-span-3 w-full flex flex-1 justify-start items-center gap-4 px-2 flex-col">
        <div className="w-full">
          <p className="text-lg text-txtPrimary">Create a new Template</p>
        </div>

        {/* template section */}
        <div className="w-full flex items-center justify-end">
          <p className="text-base text-txtLight uppercase font-semibold">
            TempID :{" "}
          </p>
          <p className="text-sm text-txtDark capitalize font-bold">
            {templates && templates.length > 0
              ? `template${templates.length + 1}`
              : "template1"}
          </p>
        </div>

        {/* Input field */}
        <input
          type="text"
          placeholder="Enter the Template Title"
          className="w-full px-4 py-3 rounded-md bg-transparent border border-gray-300 text-lg text-txtLight focus:text-txtDark focus:shadow-md outline-none"
          name="title"
          value={formData.title}
          onChange={handleInputChange}
        />

        {/* Uploading section */}
        <div className="w-full h-full gap-4 flex flex-col justify-center items-center relative">
          {imageAssets.isImageLoading && (
            <div className="w-full h-full flex flex-col justify-center items-center gap-4 absolute z-50 backdrop-blur-md">
              <PuffLoader
                color="#F07295"
                loading={imageAssets.isImageLoading}
                size={30}
              />
              <p className="text-lg text-txtPrimary font-semibold">
                {imageAssets?.progress.toFixed(2)}%
              </p>
            </div>
          )}

          {!imageAssets.url ? (
            <label
              className="w-full h-full px-4 py-10 border-2 border-dotted border-txtPrimary rounded-md shadow-md shadow-slate-400 cursor-pointer
              flex flex-col items-center justify-center"
            >
              <FaUpload className="text-txtPrimary text-2xl" />
              <p className="text-lg text-txtPrimary">Click to Upload</p>
              <input
                type="file"
                className="w-0 h-0"
                onChange={handleFileSelect}
              />
            </label>
          ) : (
            <div className="relative w-full">
              <img
                src={imageAssets.url}
                loading="lazy"
                alt="uploaded"
                className="w-full h-full object-cover rounded-md"
              />
              <button
                type="button"
                className="absolute top-2 right-2 p-3 rounded-full shadow-sm shadow-red-500 bg-slate-100 text-lg text-txtPrimary"
                onClick={deleteAnImageObject}
              >
                <FaTrash />
              </button>
            </div>
          )}
        </div>

        {/* Selected tags */}
        <div className="w-full flex justify-start items-start flex-col gap-4">
          <p className="text-txtLight uppercase font-semibold">
            Select The Template Tags
          </p>
          <div className="w-full flex justify-start items-center gap-4 flex-wrap">
            {initialTags.map((tag, i) => (
              <p
                key={i}
                onClick={() => handleSelectTags(tag)}
                className={`px-4 py-1 border-gray-300 border-2 cursor-pointer rounded-md text-base text-txtPrimary ${
                  selectedTags.includes(tag)
                    ? "bg-blue-500 text-white"
                    : "bg-transparent text-txtPrimary"
                }`}
              >
                {tag}
              </p>
            ))}
          </div>
        </div>

        {/* Submit button */}
        <div className="w-full flex items-center justify-center">
          <button
            type="button"
            onClick={pushToCloud}
            className="px-4 py-2 w-full text-lg bg-blue-700 text-white font-semibold rounded-md hover:bg-blue-600
            transition-all ease-in-out duration-150"
          >
            Save Template
          </button>
        </div>
      </div>

      {/* Right Container */}
      <div className="col-span-12 lg:col-span-8 2xl:col-span-9 w-full py-4 px-2 lg:px-6">
        {templatesIsLoading ? (
          <div className="flex items-center justify-center">
            <PuffLoader
              color="#F07295"
              loading={templatesIsLoading}
              size={50}
            />
          </div>
        ) : templatesIsError ? (
          <p className="text-lg text-red-500 font-semibold">
            Error while fetching templates
          </p>
        ) : templates && templates.length > 0 ? (
          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
            {templates.map((template) => (
              <div
                key={template._id}
                className="flex flex-col justify-start items-start w-full bg-slate-100 rounded-md shadow-md shadow-slate-400"
              >
                <img
                  src={template.imageURL}
                  alt="template"
                  className="w-full h-full object-cover rounded-md"
                />
                <div className="flex flex-col justify-start items-start p-4">
                  <p className="text-lg text-txtPrimary font-semibold">
                    {template.title}
                  </p>
                  <p className="text-sm text-txtSecondary">
                    Tags: {template.tags.join(", ")}
                  </p>
                  <div className="flex justify-end items-end w-full mt-2">
                    <button
                      type="button"
                      className="px-4 py-1 bg-red-500 font-semibold rounded-md transition-all ease-in-out duration-150"
                      onClick={() => removeTemplate(template)}
                    >
                       <FaTrash className="text-sm text-white" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-lg text-txtPrimary font-semibold">
            No templates found.
          </p>
        )}
      </div>
    </div>
  );
};

export default CreateTemplate;
