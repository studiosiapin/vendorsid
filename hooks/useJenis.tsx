import { useState } from 'react';
import { Jenis } from '@prisma/client';
import { z } from 'zod';
import { toast } from 'react-hot-toast';

// Define the schema for Jenis
export const jenisFormSchemaDefault = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  harga: z.number().positive('Harga must be a positive number'),
  description: z.string().optional()
});

// Custom hook for handling Jenis operations
export function useGetAllJenis() {
  const [isLoading, setIsLoading] = useState(false);
  const [jenisData, setJenisData] = useState<Jenis[]>([]);
  const [error, setError] = useState<string | null>(null);

  const getAllJenis = async ({
    searchQuery = '',
    page = 1,
    limit = 10
  }: {
    searchQuery?: string;
    page?: number;
    limit?: number;
  }) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `/api/jenis?searchQuery=${encodeURIComponent(
          searchQuery
        )}&page=${page}&limit=${limit}`,
        {
          cache: 'force-cache',
          next: {
            revalidate: 60
          }
        }
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error('Failed to fetch jenis data');
      }

      setJenisData(data.data);
      return data; // Return the fetched data
    } catch (error) {
      setError('Error fetching jenis data');
      toast.error('Error fetching jenis data');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    jenisData,
    error,
    getAllJenis
  };
}

export function useCreateJenis() {
  const [isLoading, setIsLoading] = useState(false);

  const createJenis = async (
    jenisData: z.infer<typeof jenisFormSchemaDefault>,
    imageUrl: string
  ) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/jenis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ ...jenisData, imageUrl })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create jenis');
      }

      toast.success(data.message);
      return data;
    } catch (error) {
      toast.error('Error creating jenis');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    createJenis
  };
}

export function useGetJenisById() {
  const [isLoading, setIsLoading] = useState(false);

  const getJenisById = async (id: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/jenis/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        cache: 'force-cache',
        next: {
          revalidate: 60
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch jenis data');
      }

      return data;
    } catch (error) {
      toast.error('Error fetching jenis data');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    getJenisById
  };
}

export function useUpdateJenis() {
  const [isLoading, setIsLoading] = useState(false);

  const updateJenis = async (
    id: string,
    jenisData: z.infer<typeof jenisFormSchemaDefault>,
    imageUrl: string
  ) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/jenis/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ ...jenisData, imageUrl })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update jenis');
      }

      toast.success(data.message);
      return data;
    } catch (error) {
      toast.error('Error updating jenis');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    updateJenis
  };
}

export function useDeleteJenis() {
  const [isLoading, setIsLoading] = useState(false);

  const deleteJenis = async (id: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/jenis/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete jenis');
      }

      toast.success(data.message);
      return data;
    } catch (error) {
      toast.error('Error deleting jenis');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    deleteJenis
  };
}
