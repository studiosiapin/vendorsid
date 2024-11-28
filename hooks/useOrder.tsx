import { useState } from 'react';
import Swal from 'sweetalert2';

// Define the type for order detail
interface OrderDetail {
    quantity: number;
    ukuranId: string;
}

// Define the type for form data
export interface orderFormDataType {
    invoiceId: string;
    title: string;
    description: string;
    linkMockup: string;
    linkCollar: string;
    linkLayout: string;
    linkSharedrive: string;
    totalAmount: number;
    dpAmount: number;
    settlementAmount: number | null;
    bahanCode: string;
    jenisCode: string;
    shipmentCode: string | null;
    createdBy: string;
    proofDp: string | null;
    orderDetails: OrderDetail[];
}

export function useGetAllOrders() {
    const [isLoading, setIsLoading] = useState(false);
    const [orders, setOrders] = useState<orderFormDataType[]>();
    const [error, setError] = useState<string | null>(null);

    const getAllOrders = async () => {
        setIsLoading(true);
        setError(null); // Reset any previous errors

        try {
            const response = await fetch('/api/order');

            const data: orderFormDataType[] = await response.json();

            if (!response.ok) {
                throw new Error('Something went wrong');
            }

            setOrders(data);
            return data; // Returning the fetched data
        } catch (error) {
            setError('Error fetching orders');
            // toast.error('Error fetching orders');
            throw error; // Propagate the error
        } finally {
            setIsLoading(false);
        }
    };

    return {
        isLoading,
        orders,
        error,
        getAllOrders
    };
}

export function useCreateOrder() {
    const [isLoading, setIsLoading] = useState(false);

    const createOrder = async (orderData: orderFormDataType) => {
        setIsLoading(true);
        try {
            const response = await fetch('/api/order', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(orderData)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Something went wrong');
            }

            // toast.success(data.message);
            return data; // Return the new order object returned from API
        } catch (error) {
            // toast.error('Error creating order');
            throw error; // Propagate the error to the caller
        } finally {
            setIsLoading(false);
        }
    };

    return {
        isLoading,
        createOrder
    };
}

export function useGetOrderById() {
    const [isLoading, setIsLoading] = useState(false);

    const getOrderById = async (orderId: string) => {
        setIsLoading(true);
        try {
            const response = await fetch(`/api/order/${orderId}`, {});

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Something went wrong');
            }

            return data; // Return the order object returned from API
        } catch (error) {
            // toast.error('Error fetching order details');
            throw error; // Propagate the error to the caller
        } finally {
            setIsLoading(false);
        }
    };

    return {
        isLoading,
        getOrderById
    };
}

export function useUpdateOrder() {
    const [isLoading, setIsLoading] = useState(false);

    const updateOrder = async (
        orderId: string,
        orderData: orderFormDataType
    ) => {
        setIsLoading(true);
        try {
            const response = await fetch(`/api/order/${orderId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(orderData)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Something went wrong');
            }

            // toast.success(data.message);
            return data; // Return the updated order object returned from API
        } catch (error) {
            // toast.error('Error updating order');
            throw error; // Propagate the error to the caller
        } finally {
            setIsLoading(false);
        }
    };

    return {
        isLoading,
        updateOrder
    };
}

// update order status
export function useUpdateOrderStatus() {
    const [isLoading, setIsLoading] = useState(false);

    const updateOrderStatus = async (
        orderId: string,
        status: string,
        linkProgress: string | null,
        createdBy: string | null,
        shipmentLink: string | null | undefined,
        shipmentCost: number | null | undefined
    ) => {
        setIsLoading(true);
        try {
            const response = await fetch(`/api/order/status`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id: orderId,
                    status: status,
                    linkProgress,
                    createdBy,
                    shipmentLink,
                    shipmentCost
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Something went wrong');
            }

            Swal.fire({
                title: 'Order Status Updated',
                text: 'Order status updated successfully',
                icon: 'success',
                timer: 2000,
                showConfirmButton: false
            });
            return data; // Return the updated order object returned from API
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Error updating order status'
            });
            throw error; // Propagate the error to the caller
        } finally {
            setIsLoading(false);
        }
    };

    return {
        isLoading,
        updateOrderStatus
    };
}

// Get Order Progress by ID
export function useOrderProgress() {
    const [isLoading, setIsLoading] = useState(false);

    const getOrderProgress = async (orderId: string) => {
        setIsLoading(true);
        try {
            const response = await fetch(`/api/order/${orderId}/tracking`, {});

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Something went wrong');
            }

            return data; // Return the order progress object returned from API
        } catch (error) {
            // toast.error('Error fetching order progress');
            throw error; // Propagate the error to the caller
        } finally {
            setIsLoading(false);
        }
    };

    return {
        isLoading,
        getOrderProgress
    };
}

// Complete Order
export function useCompleteOrder() {
    const [isLoading, setIsLoading] = useState(false);

    const completeOrder = async (
        orderId: string,
        linkProgress: string,
        userId: string,
        settlementAmount: number,
        proofSettlement: string | null | undefined
    ) => {
        setIsLoading(true);
        try {
            const response = await fetch(`/api/order/${orderId}/complete`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    linkProgress,
                    userId,
                    settlementAmount,
                    proofSettlement
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Something went wrong');
            }

            // toast.success(data.message);
            return data; // Return the updated order object returned from API
        } catch (error) {
            // toast.error('Error completing order');
            throw error; // Propagate the error to the caller
        } finally {
            setIsLoading(false);
        }
    };

    return {
        isLoading,
        completeOrder
    };
}
