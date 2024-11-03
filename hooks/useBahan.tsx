import { BaseAPIResponse } from '@/types/common';
import { Bahan } from '@prisma/client'; // Pastikan Bahan adalah tipe data yang sesuai dengan database Anda
import { useState } from 'react';
import { z } from 'zod';
import toast from 'react-hot-toast';

// Define the schema for Bahan, similar to ukuranFormSchemaDefault
export const bahanFormSchemaDefault = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional()
});

export function useGetAllBahan() {
  const [isLoading, setIsLoading] = useState(false);
  const [bahan, setBahan] =
    useState<
      BaseAPIResponse<Omit<Bahan, 'createdAt' | 'updatedAt' | 'deletedAt'>[]>
    >();
  const [error, setError] = useState<string | null>(null);

  const getAllBahan = async ({
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
        `/api/bahan?searchQuery=${encodeURIComponent(
          searchQuery
        )}&page=${page}&limit=${limit}`
      );

      const data: BaseAPIResponse<
        Omit<Bahan, 'createdAt' | 'updatedAt' | 'deletedAt'>[]
      > = await response.json();

      if (!response.ok) {
        throw new Error('Something went wrong');
      }

      setBahan(data);
      return data; // Returning the fetched data
    } catch (error) {
      setError('Error fetching bahan');
      toast.error('Error fetching bahan');
      throw error; // Propagate the error
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    bahan,
    error,
    getAllBahan
  };
}

export function useCreateBahan() {
  const [isLoading, setIsLoading] = useState(false);

  const createBahan = async (
    bahanData: z.infer<typeof bahanFormSchemaDefault>,
    imageUrl: string
  ) => {
    setIsLoading(true);

    try {
      const response = await fetch('/api/bahan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ ...bahanData, imageUrl })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      toast.success(data.message);
      return data;
    } catch (error) {
      toast.error('Error creating bahan');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    createBahan
  };
}

export function useGetBahanById() {
  const [isLoading, setIsLoading] = useState(false);

  const getBahanById = async (id: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/bahan/${id}`, {
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
      toast.error('Error fetching bahan');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    getBahanById
  };
}

export function useUpdateBahan() {
  const [isLoading, setIsLoading] = useState(false);

  const updateBahan = async (
    id: string,
    bahanData: z.infer<typeof bahanFormSchemaDefault>,
    imageUrl: string
  ) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/bahan/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ ...bahanData, imageUrl })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      toast.success(data.message);
      return data;
    } catch (error) {
      toast.error('Error updating bahan');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    updateBahan
  };
}

export function useDeleteBahan() {
  const [isLoading, setIsLoading] = useState(false);

  const deleteBahan = async (id: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/bahan/${id}`, {
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
      toast.error('Error deleting bahan');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    deleteBahan
  };
}
