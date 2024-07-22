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
