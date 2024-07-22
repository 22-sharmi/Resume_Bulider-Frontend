import React, { useState } from "react";
import { MdLayersClear } from "react-icons/md";
import { AnimatePresence, motion } from "framer-motion";
import { slideDownUpWithScale } from "../Animations";
import { FiltersData } from "../utils/helpers";
import useFilters from "../hooks/useFilters";
import { useQueryClient } from "react-query";

const Filters = () => {
  const [isClearHoverd, setisClearHoverd] = useState(false);

  const { data: FilterData, isLoading, IsError } = useFilters();

  const queryclient = useQueryClient();

  const handleFilterValue = (value) => {
    queryclient.setQueryData("gloabalFilters", {
      ...queryclient.getQueryData("gloabalFilters"),
      searchTerm: value,
    });
  };
  
  const clearFilter = () => {
    queryclient.setQueryData("gloabalFilters", {
      ...queryclient.getQueryData("gloabalFilters"),
      searchTerm: "",
    });
}

  return (
    <div className="w-full flex justify-start items-center py-4">
      <div
        className="border border-gray-300 rounded-md px-3 py-2 mr-2 cursor-pointer group hover:shadow-md bg-gray-200 relative"
        onMouseEnter={() => setisClearHoverd(true)}
        onMouseLeave={() => setisClearHoverd(false)}
        onClick={clearFilter}
      >
        <MdLayersClear className="text-xl" />
        <AnimatePresence>
          {isClearHoverd && (
            <motion.div
              {...slideDownUpWithScale}
              className="absolute -top-8 -left-2 bg-white shadow-md rounded-md px-2 py-1"
            >
              <p className="whitespace-nowrap text-xs">Clear all</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div className="w-full flex items-center justify-start overflow-x-scroll gap-6 scrollbar-none">
        {FiltersData &&
          FiltersData.map((item) => (
            <div
              onClick={() => handleFilterValue(item.value)}
              key={item.id}
              className={`border border-gray-300 rounded-md px-6 py-2 cursor-pointer group hover:shadow-md ${
                FilterData && FilterData.searchTerm === item.value && "bg-gray-300 shadow-md"
              }`}
            >
              <p className="text-sm text-txtPrimary group-hover:text-txtDark whitespace-nowrap">
                {item.label}
              </p>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Filters;
