import React from "react";
import { Filters, MainSpinner, TemplateDesignPin } from "../components";
import useTemplates from "../hooks/useTemplates";
import { AnimatePresence } from "framer-motion";
import useFilters from "../hooks/useFilters";

const HomeContainer = () => {
  const { data: templates, isLoading, isError } = useTemplates();
  const { data: FilterData } = useFilters();

  const filteredTemplates = templates.filter((template) => {
    if (!FilterData || !FilterData.searchTerm) return true;
    const searchTerm = FilterData.searchTerm.toLowerCase();
    const templateTags = template.tags.join(" ").toLowerCase();
    return templateTags.includes(searchTerm);
  });

  if (isLoading) {
    return <MainSpinner />;
  }

  return (
    <div className="w-full px-4 lg:px-12 py-6 flex flex-col items-center justify-start">
      {/* filter section */}
      <Filters />

      {/* Render those template - resume Pin */}
      {isError ? (
        <React.Fragment>
          <h2 className="text-2xl text-red-500">Something went wrong !</h2>
          <p className="text-xl text-txtDark">Please try again</p>
        </React.Fragment>
      ) : (
        <React.Fragment>
          <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-col-3 2xl:-grid-col-4 gap-2 z-0">
            <RenderTemplate templates={filteredTemplates} />
          </div>
        </React.Fragment>
      )}
    </div>
  );
};

const RenderTemplate = ({ templates }) => {
  return (
    <React.Fragment>
      {templates && templates.length > 0 ? (
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
      ) : (
        <React.Fragment>
          <p className="text-xl text-txtDark">No Data</p>
        </React.Fragment>
      )}
    </React.Fragment>
  );
};
export default HomeContainer;