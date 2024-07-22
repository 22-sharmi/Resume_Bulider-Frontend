import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import useTemplates from "../hooks/useTemplates";
import { useNavigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { TemplateDesignPin } from "../components";
import { NoData } from "../assets";

const UserProfile = () => {
  const { user, updateUser } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState("collections");
  const { data: templates, isLoading, isError } = useTemplates();
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    displayName: user?.displayName || "",
    email: user?.email || "",
  });

  const handleSaveProfile = () => {
    if (user && updateUser) {
      updateUser(user._id, profileData);
      setEditing(false);
    }
  };

  useEffect(() => {
    if (!user) {
      navigate("/auth", { replace: true });
    }
  }, [navigate, user]);

  return (
    <div className="w-full flex flex-col items-center justify-start py-12">
      <div className="w-full">
        <img
          src="https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?ixlib=rb-4.0.36&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA&auto=format&fit=crop&w=1470&q=80"
          alt="unsplash"
          className="w-full h-full md:h-60 object-cover"
        />

        <div className="flex justify-center items-center flex-col gap-4">
          {user?.avatar ? (
            <img
              src={user.avatar}
              alt={`${user.displayName}'s avatar`}
              className="w-24 h-24 border-2 border-white -mt-12 shadow-md rounded-full"
              referrerPolicy="no-referrer"
              loading="lazy"
            />
          ) : (
            <img
              src="https://img.freepik.com/premium-vector/adorable-cyberpunk-dj-vector_868778-499.jpg"
              alt="default avatar"
              className="w-24 h-24 border-2 border-white -mt-12 shadow-md rounded-full"
              referrerPolicy="no-referrer"
            />
          )}
          <p className="text-2xl text-gray-800">{user?.displayName}</p>
        </div>
        {/* tabs */}
        <div className="flex items-center justify-center mt-12">
          <div
            className="px-4 rounded-md flex items-center justify-center gap-2 group cursor-pointer"
            onClick={() => setActiveTab("collections")}
          >
            <p
              className={`text-base text-gray-600 group-hover:text-blue-600 px-4 py-1 rounded-full ${
                activeTab === "collections" &&
                "bg-white shadow-md text-blue-600"
              }`}
            >
              Collections
            </p>
          </div>
          <div
            className="px-4 rounded-md flex items-center justify-center gap-2 group cursor-pointer"
            onClick={() => setActiveTab("profile")}
          >
            <p
              className={`text-base text-gray-600 group-hover:text-blue-600 px-4 py-1 rounded-full ${
                activeTab === "profile" && "bg-white shadow-md text-blue-600"
              }`}
            >
              My Profile
            </p>
          </div>
        </div>
        {/* tabs container */}
        <div className="w-full grid grid-cols-1 md-grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-2 px-4 py-6">
          <AnimatePresence>
            {activeTab === "collections" && (
              <React.Fragment>
                {user?.collections?.length > 0 ? (
                  <RenderTemplate
                    templates={templates?.filter((temp) =>
                      user?.collections?.includes(temp?._id)
                    )}
                    key={user._id}
                  />
                ) : (
                  <div className="col-span-12 w-full flex flex-col items-center justify-center gap-3">
                    <img
                      src={NoData}
                      alt=""
                      className="w-32 h-auto object-contain"
                    />
                    <p>No data</p>
                  </div>
                )}
              </React.Fragment>
            )}
          </AnimatePresence>
        </div>
        {activeTab === "profile" && (
          <div className="col-span-12 w-full flex flex-col items-center justify-start gap-3">
            {editing ? (
              <div className="w-full max-w-md mx-auto bg-white shadow-md rounded-lg p-6">
                <p className="text-lg font-semibold text-gray-800 mb-4">
                  Edit Profile
                </p>

                {/* Input fields for editing */}
                <div className="flex flex-col space-y-4">
                  <input
                    type="text"
                    value={profileData.displayName}
                    onChange={(e) =>
                      setProfileData({
                        ...profileData,
                        displayName: e.target.value,
                      })
                    }
                    placeholder="Display Name"
                    className="border border-gray-300 p-3 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="email"
                    value={profileData.email}
                    onChange={(e) =>
                      setProfileData({ ...profileData, email: e.target.value })
                    }
                    placeholder="Email"
                    className="border border-gray-300 p-3 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={handleSaveProfile}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md shadow transition-colors duration-300"
                  >
                    Save
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="w-full max-w-md mx-auto bg-white shadow-md rounded-lg p-6">
                  <p className="text-lg font-semibold text-gray-800 mb-4">
                    User Information
                  </p>

                  {/* Display user information */}
                  <div className="mb-4">
                    <p className="text-base font-medium text-gray-700">Name:</p>
                    <p className="text-lg text-gray-900 mb-2">
                      {profileData.displayName}
                    </p>
                    <p className="text-base font-medium text-gray-700">
                      Email:
                    </p>
                    <p className="text-lg text-gray-900">{profileData.email}</p>
                  </div>
                </div>
                <button
                  onClick={() => setEditing(true)}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md shadow transition-colors duration-300"
                >
                  Edit Profile
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const RenderTemplate = ({ templates }) => {
  return (
    <React.Fragment>
      {templates && templates.length > 0 && (
        <React.Fragment>
          <AnimatePresence>
            {templates &&
              templates.map((template, index) => (
                <TemplateDesignPin
                  key={template._id}
                  data={template}
                  index={index}
                />
              ))}
          </AnimatePresence>
        </React.Fragment>
      )}
    </React.Fragment>
  );
};

export default UserProfile;
