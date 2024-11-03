import { BaseAPIResponse } from '@/types/common';
import { Ukuran } from '@prisma/client';
import { useState } from 'react';
import { z } from 'zod';
import toast from 'react-hot-toast';

// Define the schema for Ukuran, similar to userFormSchemaDefault
// Please ensure proper schema is defined in your schema file
export const ukuranFormSchemaDefault = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional()
});

export function useGetAllUkuran() {
  const [isLoading, setIsLoading] = useState(false);
  const [ukuran, setUkuran] =
    useState<
      BaseAPIResponse<Omit<Ukuran, 'createdAt' | 'updatedAt' | 'deletedAt'>[]>
    >();
  const [error, setError] = useState<string | null>(null);

  const getAllUkuran = async ({
    searchQuery = '',
    page = 1,
    limit = 10
  }: {
    searchQuery?: string;
    page?: number;
    limit?: number;
  }) => {
    setIsLoading(true);
    setError(null); // Reset any previous errors

    try {
      const response = await fetch(
        `/api/ukuran?searchQuery=${encodeURIComponent(
          searchQuery
        )}&page=${page}&limit=${limit}`
      );

      const data: BaseAPIResponse<
        Omit<Ukuran, 'createdAt' | 'updatedAt' | 'deletedAt'>[]
      > = await response.json();

      if (!response.ok) {
        throw new Error('Something went wrong');
      }

      setUkuran(data);
      return data; // Returning the fetched data
    } catch (error) {
      setError('Error fetching ukuran');
      toast.error('Error fetching ukuran');
      throw error; // Propagate the error
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    ukuran,
    error,
    getAllUkuran
  };
}

export function useCreateUkuran() {
  const [isLoading, setIsLoading] = useState(false);

  const createUkuran = async (
    ukuranData: z.infer<typeof ukuranFormSchemaDefault>
  ) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/ukuran', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(ukuranData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      toast.success(data.message);
      return data;
    } catch (error) {
      toast.error('Error creating ukuran');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    createUkuran
  };
}

export function useGetUkuranById() {
  const [isLoading, setIsLoading] = useState(false);

  const getUkuranById = async (id: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/ukuran/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      return data;
    } catch (error) {
      toast.error('Error fetching ukuran');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    getUkuranById
  };
}

export function useUpdateUkuran() {
  const [isLoading, setIsLoading] = useState(false);

  const updateUkuran = async (
    id: string,
    ukuranData: z.infer<typeof ukuranFormSchemaDefault>
  ) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/ukuran/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(ukuranData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      toast.success(data.message);
      return data;
    } catch (error) {
      toast.error('Error updating ukuran');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    updateUkuran
  };
}

export function useDeleteUkuran() {
  const [isLoading, setIsLoading] = useState(false);

  const deleteUkuran = async (id: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/ukuran/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      toast.success(data.message);
      return data;
    } catch (error) {
      toast.error('Error deleting ukuran');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    deleteUkuran
  };
}
