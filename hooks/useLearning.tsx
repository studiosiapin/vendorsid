import { useState } from 'react';
import { Learning } from '@prisma/client';
import { z } from 'zod';
import { toast } from 'react-hot-toast';

// Define the schema for Learning
export const learningFormSchemaDefault = z.object({
    thumbnail: z.string().min(1, 'Thumbnail is required'),
    name: z.string().min(1, 'Name is required'),
    source: z.string().optional(),
    description: z.string().optional()
});

// Custom hook for handling Learning operations
export function useGetAllLearning() {
    const [isLoading, setIsLoading] = useState(false);
    const [learningData, setLearningData] = useState<Learning[]>([]);
    const [error, setError] = useState<string | null>(null);

    const getAllLearning = async ({
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
                `/api/learning?searchQuery=${encodeURIComponent(
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
                throw new Error('Failed to fetch learning data');
            }

            setLearningData(data.data);
            return data; // Return the fetched data
        } catch (error) {
            setError('Error fetching learning data');
            toast.error('Error fetching learning data');
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    return {
        isLoading,
        learningData,
        error,
        getAllLearning
    };
}

export function useCreateLearning() {
    const [isLoading, setIsLoading] = useState(false);

    const createLearning = async (
        learningData: z.infer<typeof learningFormSchemaDefault>
    ) => {
        setIsLoading(true);
        try {
            const response = await fetch('/api/learning', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(learningData)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to create learning');
            }

            toast.success(data.message);
            return data;
        } catch (error) {
            toast.error('Error creating learning');
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    return {
        isLoading,
        createLearning
    };
}

export function useGetLearningById() {
    const [isLoading, setIsLoading] = useState(false);

    const getLearningById = async (id: string) => {
        setIsLoading(true);
        try {
            const response = await fetch(`/api/learning/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to fetch learning data');
            }

            return data;
        } catch (error) {
            toast.error('Error fetching learning data');
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    return {
        isLoading,
        getLearningById
    };
}

export function useUpdateLearning() {
    const [isLoading, setIsLoading] = useState(false);

    const updateLearning = async (
        id: string,
        learningData: z.infer<typeof learningFormSchemaDefault>
    ) => {
        setIsLoading(true);
        try {
            const response = await fetch(`/api/learning/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(learningData)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to update learning');
            }

            toast.success(data.message);
            return data;
        } catch (error) {
            toast.error('Error updating learning');
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    return {
        isLoading,
        updateLearning
    };
}

export function useDeleteLearning() {
    const [isLoading, setIsLoading] = useState(false);

    const deleteLearning = async (id: string) => {
        setIsLoading(true);
        try {
            const response = await fetch(`/api/learning/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to delete learning');
            }

            toast.success(data.message);
            return data;
        } catch (error) {
            toast.error('Error deleting learning');
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    return {
        isLoading,
        deleteLearning
    };
}
