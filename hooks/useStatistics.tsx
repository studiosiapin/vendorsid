import { useState } from 'react';

// get statistics
export const useStatistics = () => {
  const [isLoading, setIsLoading] = useState(true);

  const getStatistics = async (id: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/statistics/${id}`);
      const data = await response.json();
      setIsLoading(false);
      return data;
    } catch (error) {
      setIsLoading(false);
      console.error(error);
    }
  };

  return {
    isLoading,
    getStatistics
  };
};
