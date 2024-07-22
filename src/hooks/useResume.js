import { useQuery, useMutation, useQueryClient } from 'react-query';
import axios from 'axios';
import { generatePDF } from '../utils/pdfGenerator';

const API_URL = 'http://localhost:5555/api';

export function useResume() {
  const queryClient = useQueryClient();

  const { data: resume, isLoading, error } = useQuery('resume', async () => {
    const { data } = await axios.get(`${API_URL}/resume`);
    return data;
  });

  const mutation = useMutation(
    (updatedResume) => axios.put(`${API_URL}/resume`, updatedResume),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('resume');
      },
      onError: (error) => {
        console.error('Error updating resume:', error.response?.data || error.message);
      }
    }
  );

  const updateResumeData = (updatedData) => {
    mutation.mutate(updatedData);
  };

  const saveResume = () => {
    if (resume) {
      mutation.mutate(resume);
    }
  };

  return {
    resume,
    isLoading,
    error,
    updateResumeData,
    saveResume,
    generatePDF: () => generatePDF(resume),
  };
}
