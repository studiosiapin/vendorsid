import { useState } from 'react';

// get statistics
export const useStatistics = () => {
  const [isLoading, setIsLoading] = useState(false);

  const getStatistics = async (
    id: string,
    startDate?: string,
    endDate?: string
  ) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/statistics/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ startDate, endDate })
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error(error);
      return null; // Return null or handle the error as needed
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    getStatistics
  };
};
