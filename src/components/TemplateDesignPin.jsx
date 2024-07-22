import React, { useContext, useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FadeInOutWithOpacity, scaleInOut } from "../Animations";
import {
  BiSolidFolderPlus,
  BiFolderPlus,
  BiSolidHeart,
  BiHeart,
} from "react-icons/bi";
import { AuthContext } from "../contexts/AuthContext";
import {
  saveToCollections,
  removeFromCollections,
  saveToFavorites,
  removeFromFavorites,
} from "../api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const TemplateDesignPin = ({ data, index }) => {
  const { user, refetch: userRefetch } = useContext(AuthContext);
  const [isInCollection, setIsInCollection] = useState(false);
  const [isInFavorites, setIsInFavorites] = useState(false);
  const [isHovered, setisHovered] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (user && user.collections && user.favorites) {
      setIsInCollection(user.collections.includes(data._id));
      setIsInFavorites(user.favorites.includes(data._id));
    }
  }, [user, data._id]);

  const toggleCollection = async (e) => {
    e.stopPropagation();
    if (!user) {
      toast.error("Please log in to manage collections");
      return;
    }
    try {
      if (isInCollection) {
        await removeFromCollections(user._id, data._id);
        setIsInCollection(false);
        toast.success("Removed from collection!");
      } else {
        await saveToCollections(user._id, data._id);
        setIsInCollection(true);
        toast.success("Added to collection!");
      }
      userRefetch();
    } catch (error) {
      console.error("Error toggling collection:", error);
      toast.error("Failed to update collection");
    }
  };

  const toggleFavorites = async (e) => {
    e.stopPropagation();
    if (!user) {
      toast.error("Please log in to manage favorites");
      return;
    }
    try {
      if (isInFavorites) {
        await removeFromFavorites(user._id, data._id);
        setIsInFavorites(false);
        toast.success("Removed from favorites!");
      } else {
        await saveToFavorites(user._id, data._id);
        setIsInFavorites(true);
        toast.success("Added to favorites!");
      }
      userRefetch();
    } catch (error) {
      console.error("Error toggling favorites:", error);
      toast.error("Failed to update favorites");
    }
  };

  const handleRouteNavigation =()=>{
    navigate(`/resumeDetail/${data._id}`,{replace: true});
  }

  return (
    <motion.div key={data._id} {...scaleInOut(index)}>
      <div
        className="w-full h-[500px] lg:h-[740px] 2xl:h-[1250px] rounded-md bg-gray-200 overflow-hidden relative"
        onMouseEnter={() => setisHovered(true)}
        onMouseLeave={() => setisHovered(false)}
      >
        <img
          src={data?.imageURL}
          className="w-full h-full object-cover"
          alt=""
        />

        <AnimatePresence>
          {isHovered && (
            <motion.div
            onClick={handleRouteNavigation}
              {...FadeInOutWithOpacity}
              className="absolute inset-0 bg-[rgba(0,0,0,0.4)] flex flex-col justify-start items-center px-4 py-3 z-50 cursor-pointer"
            >
              <div className="flex flex-col items-end justify-start w-full gap-8">
                <InnerBoxCard
                  label={
                    isInCollection
                      ? "Remove from Collection"
                      : "Add to Collection"
                  }
                  Icon={isInCollection ? BiSolidFolderPlus : BiFolderPlus}
                  onHandle={toggleCollection}
                  isAdded={isInCollection}
                />
                <InnerBoxCard
                  label={
                    isInFavorites ? "Remove from Favorites" : "Add to Favorites"
                  }
                  Icon={isInFavorites ? BiSolidHeart : BiHeart}
                  onHandle={toggleFavorites}
                  isAdded={isInFavorites}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

const InnerBoxCard = ({ label, Icon, onHandle, isAdded }) => {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <div
      onClick={onHandle}
      className="w-10 h-10 rounded-md bg-gray-200 flex items-center justify-center hover:shadow-md relative transition-colors duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Icon
        className={`${isAdded ? "text-gray-900" : "text-txtPrimary"} text-base`}
      />
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, scale: 0.6, x: 50 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.6, x: 50 }}
            className={`px-3 py-2 rounded-md bg-gray-200 absolute ${
              isAdded ? "-left-52" : "-left-44"
            } after:h-2 after:w-2 after:bg-gray-200 after:absolute after:-right-1 after:top-[14px] after:rotate-45`}
          >
            <p className="text-sm text-txtPrimary whitespace-nowrap">{label}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TemplateDesignPin;