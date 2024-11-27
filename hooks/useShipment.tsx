import { BaseAPIResponse } from '@/types/common';
import { Shipment } from '@prisma/client';
import { useState } from 'react';
import { z } from 'zod';
import toast from 'react-hot-toast';

// Define the schema for Shipment
export const shipmentFormSchemaDefault = z.object({
    code: z.string().min(1, 'Code is required'),
    title: z.string().min(1, 'Title is required'),
    description: z.string().optional(),
    logo: z.string().min(1, 'Logo is required')
});

export function useGetAllShipments() {
    const [isLoading, setIsLoading] = useState(false);
    const [shipments, setShipments] =
        useState<
            BaseAPIResponse<
                Omit<Shipment, 'createdAt' | 'updatedAt' | 'deletedAt'>[]
            >
        >();
    const [error, setError] = useState<string | null>(null);

    const getAllShipments = async ({
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
                `/api/shipment?searchQuery=${encodeURIComponent(
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
                Omit<Shipment, 'createdAt' | 'updatedAt' | 'deletedAt'>[]
            > = await response.json();

            if (!response.ok) {
                throw new Error('Something went wrong');
            }

            setShipments(data);
            return data; // Returning the fetched data
        } catch (error) {
            setError('Error fetching shipments');
            toast.error('Error fetching shipments');
            throw error; // Propagate the error
        } finally {
            setIsLoading(false);
        }
    };

    return {
        isLoading,
        shipments,
        error,
        getAllShipments
    };
}

export function useCreateShipment() {
    const [isLoading, setIsLoading] = useState(false);

    const createShipment = async (
        shipmentData: z.infer<typeof shipmentFormSchemaDefault>
    ) => {
        setIsLoading(true);

        try {
            const response = await fetch('/api/shipment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(shipmentData)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Something went wrong');
            }

            toast.success(data.message);
            return data;
        } catch (error) {
            toast.error('Error creating shipment');
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    return {
        isLoading,
        createShipment
    };
}

export function useGetShipmentById() {
    const [isLoading, setIsLoading] = useState(false);

    const getShipmentById = async (id: string) => {
        setIsLoading(true);
        try {
            const response = await fetch(`/api/shipment/${id}`, {
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
            toast.error('Error fetching shipment');
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    return {
        isLoading,
        getShipmentById
    };
}

export function useUpdateShipment() {
    const [isLoading, setIsLoading] = useState(false);

    const updateShipment = async (
        id: string,
        shipmentData: z.infer<typeof shipmentFormSchemaDefault>
    ) => {
        setIsLoading(true);
        try {
            const response = await fetch(`/api/shipment/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(shipmentData)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Something went wrong');
            }

            toast.success(data.message);
            return data;
        } catch (error) {
            toast.error('Error updating shipment');
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    return {
        isLoading,
        updateShipment
    };
}

export function useDeleteShipment() {
    const [isLoading, setIsLoading] = useState(false);

    const deleteShipment = async (id: string) => {
        setIsLoading(true);
        try {
            const response = await fetch(`/api/shipment/${id}`, {
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
            toast.error('Error deleting shipment');
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    return {
        isLoading,
        deleteShipment
    };
}
