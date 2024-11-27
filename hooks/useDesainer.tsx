import { BaseAPIResponse } from '@/types/common';
import { Desainer } from '@prisma/client';
import { useState } from 'react';
import { z } from 'zod';
import toast from 'react-hot-toast';

// Define the schema for Desainer
export const desainerFormSchemaDefault = z.object({
    imageUrl: z.string().min(1, 'Profile picture is required'),
    name: z.string().min(1, 'Name is required'),
    phone: z.string().optional(),
    portofolio: z.string().optional(),
    description: z.string().optional()
});

export function useGetAllDesainer() {
    const [isLoading, setIsLoading] = useState(false);
    const [desainer, setDesainer] =
        useState<
            BaseAPIResponse<
                Omit<Desainer, 'createdAt' | 'updatedAt' | 'deletedAt'>[]
            >
        >();
    const [error, setError] = useState<string | null>(null);

    const getAllDesainer = async ({
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
                `/api/desainer?searchQuery=${encodeURIComponent(
                    searchQuery
                )}&page=${page}&limit=${limit}`,
                {
                    cache: 'force-cache',
                    next: {
                        revalidate: 60
                    }
                }
            );

            const data: BaseAPIResponse<
                Omit<Desainer, 'createdAt' | 'updatedAt' | 'deletedAt'>[]
            > = await response.json();

            if (!response.ok) {
                throw new Error('Something went wrong');
            }

            setDesainer(data);
            return data; // Returning the fetched data
        } catch (error) {
            setError('Error fetching desainer');
            toast.error('Error fetching desainer');
            throw error; // Propagate the error
        } finally {
            setIsLoading(false);
        }
    };

    return {
        isLoading,
        desainer,
        error,
        getAllDesainer
    };
}

export function useCreateDesainer() {
    const [isLoading, setIsLoading] = useState(false);

    const createDesainer = async (
        desainerData: z.infer<typeof desainerFormSchemaDefault>
    ) => {
        setIsLoading(true);
        try {
            const response = await fetch('/api/desainer', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(desainerData)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Something went wrong');
            }

            toast.success(data.message);
            return data;
        } catch (error) {
            toast.error('Error creating desainer');
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    return {
        isLoading,
        createDesainer
    };
}

export function useGetDesainerById() {
    const [isLoading, setIsLoading] = useState(false);

    const getDesainerById = async (id: string) => {
        setIsLoading(true);
        try {
            const response = await fetch(`/api/desainer/${id}`, {
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
            toast.error('Error fetching desainer');
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    return {
        isLoading,
        getDesainerById
    };
}

export function useUpdateDesainer() {
    const [isLoading, setIsLoading] = useState(false);

    const updateDesainer = async (
        id: string,
        desainerData: z.infer<typeof desainerFormSchemaDefault>
    ) => {
        setIsLoading(true);
        try {
            const response = await fetch(`/api/desainer/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(desainerData)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Something went wrong');
            }

            toast.success(data.message);
            return data;
        } catch (error) {
            toast.error('Error updating desainer');
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    return {
        isLoading,
        updateDesainer
    };
}

export function useDeleteDesainer() {
    const [isLoading, setIsLoading] = useState(false);

    const deleteDesainer = async (id: string) => {
        setIsLoading(true);
        try {
            const response = await fetch(`/api/desainer/${id}`, {
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
            toast.error('Error deleting desainer');
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    return {
        isLoading,
        deleteDesainer
    };
}
