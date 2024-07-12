// import { useQuery } from "react-query";
// import { toast } from "react-toastify";
// import { getTemplates } from "../api";
// const useTemplates = () => {
//   const { data, isLoading, isError, refetch } = useQuery(
//     "templates",
//     async () => {
//       try {
//         const templates = await getTemplates();
//         return templates;
//       } catch (error) {
//         console.log(error);
//         toast.error("Something Went Wrong!");
//       }
//     },
//     {
//       refetchOnWindowFocus: false,
//     }
//   );
//   return { data, isLoading, isError, refetch };
// };

// export default useTemplates;

import { useState, useEffect } from 'react';
import axios from 'axios';

const useTemplates = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const fetchTemplates = async () => {
    try {
      setIsLoading(true);
      setIsError(false);
      const response = await axios.get('http://localhost:5555/api/templates');
      setData(response.data);
    } catch (error) {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  return { data, isLoading, isError, refetch: fetchTemplates };
};

export default useTemplates;
