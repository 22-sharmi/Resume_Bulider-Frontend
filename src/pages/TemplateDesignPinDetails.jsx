import React, { useContext, useState, useEffect } from "react";
import { useQuery } from "react-query";
import { Link, useParams } from "react-router-dom";
import {
  getTemplateDetails,
  saveToCollections,
  removeFromCollections,
  saveToFavorites,
  removeFromFavorites,
} from "../api";
import { MainSpinner, TemplateDesignPin } from "../components";
import { FaHouse } from "react-icons/fa6";
import {
  BiSolidHeart,
  BiHeart,
  BiSolidFolderPlus,
  BiFolderPlus,
} from "react-icons/bi";
import { AuthContext } from "../contexts/AuthContext";
import useTemplates from "../hooks/useTemplates";
import { toast } from "react-toastify";
import { PuffLoader } from "react-spinners";
import { AnimatePresence } from "framer-motion";

const TemplateDesignPinDetails = () => {
  const { templateID } = useParams();
  const {
    data: templateData,
    isError,
    isLoading,
    refetch: refetchTemplate,
  } = useQuery(["template", templateID], () => getTemplateDetails(templateID));

  const { user, refetch: userRefetch } = useContext(AuthContext);
  const { data: templates } = useTemplates();
  const [isInCollection, setIsInCollection] = useState(false);
  const [isInFavorites, setIsInFavorites] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    if (user && user.collections && user.favorites) {
      setIsInCollection(user.collections.includes(templateID));
      setIsInFavorites(user.favorites.includes(templateID));
    }
  }, [user, templateID]);

  const toggleCollection = async () => {
    if (!user) {
      toast.error("Please log in to manage collections");
      return;
    }
    try {
      if (isInCollection) {
        await removeFromCollections(user._id, templateID);
        setIsInCollection(false);
        toast.success("Removed from collection!");
      } else {
        await saveToCollections(user._id, templateID);
        setIsInCollection(true);
        toast.success("Added to collection!");
      }
      await userRefetch();
      await refetchTemplate();
    } catch (error) {
      console.error("Error toggling collection:", error);
      toast.error("Failed to update collection");
    }
  };

  const toggleFavorites = async () => {
    if (!user) {
      toast.error("Please log in to manage favorites");
      return;
    }
    try {
      if (isInFavorites) {
        await removeFromFavorites(user._id, templateID);
        setIsInFavorites(false);
        toast.success("Removed from favorites!");
      } else {
        await saveToFavorites(user._id, templateID);
        setIsInFavorites(true);
        toast.success("Added to favorites!");
      }
      await userRefetch();
      await refetchTemplate();
    } catch (error) {
      console.error("Error toggling favorites:", error);
      toast.error("Failed to update favorites");
    }
  };

  if (isLoading) return <MainSpinner />;
  if (isError)
    return (
      <div className="w-full h-[60vh] flex flex-col items-center justify-center text-red-500 text-lg font-semibold">
        Error While fetching the data
        <span className="text-base text-txtDark">
          Please Refresh or Try Again later
        </span>
      </div>
    );

  return (
    <div className="w-full flex items-center justify-start flex-col px-4 py-12">
      {/* bread crumb */}
      <div className="w-full flex items-center pb-8 gap-2">
        <Link
          to={"/"}
          className="flex items-center justify-center gap-2 text-txtPrimary"
        >
          <FaHouse /> Home
        </Link>
        <p>/</p>
        <p>{templateData?.name}</p>
      </div>
      {/* main section layout */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-12">
        {/* left section */}
        <div className="col-span-1 lg:col-span-8 flex flex-col items-start justify-start gap-4">
          {/* load the template img */}
          <div className="w-full h-auto rounded-md relative">
            {!imageLoaded && (
              <div className="w-screen h-screen flex items-center justify-center">
                <PuffLoader color="#498FCD" size={40} />
              </div>
            )}
            <img
              src={templateData?.imageURL}
              alt="template"
              className={`w-full h-full object-contain rounded-md ${
                imageLoaded ? "opacity-100" : "opacity-0"
              }`}
              onLoad={() => setImageLoaded(true)}
            />
          </div>
          {/* title and other options */}
          <div className="w-full flex flex-col items-start justify-start gap-2">
            {/* title section */}
            <div className="w-full flex justify-between items-center">
              {/* title */}
              <p className="text-base text-txtPrimary font-semibold">
                {templateData?.title}
              </p>
              {/* likes */}
              {user && user.favorites.length > 0 && (
                <div className="flex items-center justify-center gap-1">
                  <BiSolidHeart className="text-base text-red-500" />
                  <p className="text-base text-txtPrimary font-semibold">
                    {user.favorites.length}
                    {user.favorites.length === 1 ? " Like" : " Likes"}
                  </p>
                </div>
              )}
            </div>
            {/* collection favorites options */}
            {user && (
              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={toggleCollection}
                  className="flex items-center justify-center gap-2 px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-200 cursor-pointer whitespace-nowrap"
                >
                  {isInCollection ? (
                    <BiSolidFolderPlus className="text-txtPrimary text-base" />
                  ) : (
                    <BiFolderPlus className="text-txtPrimary text-base" />
                  )}
                  {isInCollection
                    ? "Remove from Collection"
                    : "Add to Collection"}
                </button>
                <button
                  onClick={toggleFavorites}
                  className="flex items-center justify-center gap-2 px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-200 cursor-pointer whitespace-nowrap"
                >
                  {isInFavorites ? (
                    <BiSolidHeart className="text-txtPrimary text-base" />
                  ) : (
                    <BiHeart className="text-txtPrimary text-base" />
                  )}
                  {isInFavorites ? "Remove from Favorites" : "Add to Favorites"}
                </button>
              </div>
            )}
          </div>
        </div>
        {/* right section */}
        <div className="col-span-1 lg:col-span-4 w-full flex flex-col items-center justify-start px-3 gap-6">
          {/* discover more */}
          <div
            className="w-full h-72 bg-blue-200 rounded-md overflow-hidden relative"
            style={{
              background:
                "url(https://images.unsplash.com/photo-1473773508845-188df298d2d1?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=600&q=80)",
              backgroundPosition: "center",
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
            }}
          >
            <div className="absolute inset-0 flex items-center justify-center bg-[rgba(0,0,0,0.4)]">
              <Link
                to={"/"}
                className="px-2 py-2 rounded-md border border-gray-50 text-white"
              >
                Discover More
              </Link>
            </div>
          </div>
          {/* edit template */}
          {user && (
            <Link
              className="w-full px-4 py-3 rounded-md flex items-center justify-center cursor-pointer bg-emerald-500"
              to={`/resume/${templateData?.name}?templateID=${templateID}`}
            >
              <p className="text-white font-semibold text-lg">
                Edit this Template
              </p>
            </Link>
          )}
          {/* tags */}
          <div className="w-full flex items-center justify-start flex-wrap gap-2">
            {templateData?.tags?.map((tag, index) => (
              <p
                key={index}
                className="text-sm border border-gray-300 px-2 py-1 rounded-md whitespace-nowrap"
              >
                {tag}
              </p>
            ))}
          </div>
        </div>
      </div>

      {/* simplar Templates */}
      {templates?.filter((temp) => temp._id !== templateData._id)?.length >
        0 && (
        <div className="w-full py-8 flex flex-col items-start justify-start gap-4">
          <p className="text-lg text-txtDark font-semibold">
            You might also like
          </p>

          <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-2">
            <React.Fragment>
              <AnimatePresence>
                {templates
                  ?.filter((temp) => temp._id !== templateData._id)
                  .map((templates, index) => (
                    <TemplateDesignPin
                      key={templates._id}
                      data={templates}
                      index={index}
                    />
                  ))}
              </AnimatePresence>
            </React.Fragment>
          </div>
        </div>
      )}
    </div>
  );
};

export default TemplateDesignPinDetails;
