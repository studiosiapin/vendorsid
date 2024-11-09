import { useState } from 'react';

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
  startAt: string; // dapat menggunakan Date jika ingin lebih terstruktur
  finishAt: string; // dapat menggunakan Date jika ingin lebih terstruktur
  totalAmount: number;
  dpAmount: number;
  settlementAmount: number;
  bahanCode: string;
  jenisCode: string;
  createdBy: string;
  orderDetails: OrderDetail[];
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
      const response = await fetch(`/api/order/${orderId}`);

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

  const updateOrder = async (orderId: string, orderData: orderFormDataType) => {
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
