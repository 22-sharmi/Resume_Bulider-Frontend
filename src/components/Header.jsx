import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { PuffLoader } from "react-spinners";
import { AuthContext } from "../contexts/AuthContext";
import { Logo } from "../assets";
import { HiLogout } from "react-icons/hi";
import { FadeInOutWithOpacity, slideDownUpMenu } from "../Animations";
import { adminIds } from "../utils/helpers";
import useFilters from "../hooks/useFilters";
import { useQueryClient } from "react-query";

const Header = () => {
  const { user, isLoading, signOutUser } = useContext(AuthContext);
  const [isMenu, setisMenu] = useState(false);

  const { data: FilterData } = useFilters();

  const queryclient = useQueryClient();

  const handleSearchTerm = (e) => {
    queryclient.setQueryData("gloabalFilters", {
      ...queryclient.getQueryData("gloabalFilters"),
      searchTerm: e.target.value,
    });
  };

  const clearFilter = () => {
    queryclient.setQueryData("gloabalFilters", {
      ...queryclient.getQueryData("gloabalFilters"),
      searchTerm: "",
    });
  };

  return (
    <header className="w-full flex items-center justify-between px-4 py-2 lg:px-8 border-b border-gray-300 bg-bgPrimary z-50 sticky gap-12 top-0">
      <Link to={"/"} >
        <img
          src={Logo}
          className="w-20 h-auto object-contain font-bold"
          alt="logo"
        />
      </Link>
      <div className="flex-1 border border-gray-300 px-4 py-1 rounded-md flex items-center justify-between bg-gray-200">
        <input
          onChange={handleSearchTerm}
          value={
            FilterData && FilterData.searchTerm ? FilterData && FilterData.searchTerm : ""
          }
          type="text"
          placeholder="Search here..."
          className="flex-1 h10 bg-transparent text-base font-semibold outline-none border-none"
        />
        <AnimatePresence>
          {FilterData && FilterData.searchTerm.length > 0 && (
            <motion.div
            onClick={clearFilter}
            {...FadeInOutWithOpacity}
            className="w-8 h-8 flex items-center justify-center bg-gray-300 rounded-md cursor-pointer active:scale-95 duration-150"
          >
            <p className="text-2xl text-black">x</p>
          </motion.div>
          )}
        </AnimatePresence>
      </div>
      <AnimatePresence>
        {isLoading ? (
          <PuffLoader color="#498FCD" size={40} />
        ) : (
          <React.Fragment>
            {user ? (
              <motion.div
                {...FadeInOutWithOpacity}
                className="relative"
                onClick={() => setisMenu(!isMenu)}
              >
                {user.avatar ? (
                  <div className="w-12 h-12 rounded-md relative flex items-center justify-center cursor-pointer">
                    <img
                      src={user.avatar}
                      alt=""
                      className="w-full h-full object-cover rounded-md"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                ) : (
                  <div className="w-12 h-12 rounded-md relative flex items-center justify-center bg-blue-700 shadow-md cursor-pointer">
                    <span className="text-white text-lg">
                      {user.displayName?.charAt(0) || user.email?.charAt(0)}
                    </span>
                  </div>
                )}
                {/* dropdown menu */}
                <AnimatePresence>
                  {isMenu && (
                    <motion.div
                      {...slideDownUpMenu}
                      className="absolute px-4 py-3 rounded-md bg-white right-0 top-14 flex flex-col items-center justify-start gap-3 w-64 pt-12"
                      onMouseLeave={() => setisMenu(false)}
                    >
                      {user.avatar ? (
                        <div className="w-20 h-20 rounded-full relative flex items-center justify-center cursor-pointer">
                          <img
                            src={user.avatar}
                            alt=""
                            className="w-full h-full object-cover rounded-full"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                      ) : (
                        <div className="w-20 h-20 rounded-full relative flex items-center justify-center bg-blue-700 shadow-full cursor-pointer">
                          <span className="text-white text-3xl">
                            {user.displayName?.charAt(0) ||
                              user.email?.charAt(0)}
                          </span>
                        </div>
                      )}
                      {user?.displayName && (
                        <p className="text-txtDark text-lg">
                          {user.displayName}
                        </p>
                      )}
                      {/* menu */}
                      <div className="w-full flex-col items-start flex gap-8 pt-6">
                        <Link
                          to={`/profile/${user?._id}`}
                          className="text-txtLight hover:text-txtDark text-base whitespace-nowrap"
                        >
                          My Account
                        </Link>

                        {adminIds.includes(user?._id) && (
                          <Link
                            to="/template/create"
                            className="text-txtLight hover:text-txtDark text-base whitespace-nowrap"
                          >
                            Add New Templete
                          </Link>
                        )}

                        <div
                          className="w-full px-2 border-t border-gray-300 flex items-center justify-between group cursor-pointer"
                          onClick={signOutUser}
                        >
                          <p className="text-txtLight group-hover:text-txtDark">
                            Sign Out
                          </p>
                          <HiLogout className="text-txtLight group-hover:text-txtDark" />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ) : (
              <Link to="/auth">
                <motion.button
                  type="button"
                  className="px-4 py-2 rounded-md border border-gray-300 bg-gray-300 hover:shadow-md active:scale-95 duration-150"
                  {...FadeInOutWithOpacity}
                >
                  Log In
                </motion.button>
              </Link>
            )}
          </React.Fragment>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;