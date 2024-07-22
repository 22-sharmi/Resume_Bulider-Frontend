import { useQuery } from "react-query";

const useFilters = () => {
  const { data, isLoading, IsError, Refetch } = useQuery(
    "gloabalFilters",
    () => ({ searchTerm: "" }), 
    { refetchOnWindowFocus: false }
  );
  return { data, isLoading, IsError, Refetch };
};

export default useFilters;
