import { BaseAPIResponse } from '@/types/common';
import { userFormSchemaDefault } from '@/types/schema/userFormSchema';
import { User } from '@prisma/client';
import { useState } from 'react';
import { z } from 'zod';
import toast from 'react-hot-toast';

export function useGetAllUsers() {
  const [isLoading, setIsLoading] = useState(false);
  const [users, setUsers] =
    useState<
      BaseAPIResponse<
        Omit<User, 'password' | 'createdAt' | 'updatedAt' | 'deletedAt'>[]
      >
    >();
  const [error, setError] = useState<string | null>(null);

  const getAllUsers = async ({
    searchQuery = '',
    page = 1,
    limit = 10,
    gender = ''
  }: {
    searchQuery?: string;
    page?: number;
    limit?: number;
    gender?: string;
  }) => {
    setIsLoading(true);
    setError(null); // Reset any previous errors

    try {
      const response = await fetch(
        `/api/user?searchQuery=${encodeURIComponent(
          searchQuery
        )}&page=${page}&limit=${limit}&gender=${gender}`,
        {
          cache: 'force-cache',
          next: {
            revalidate: 60
          }
        }
      );

      const data: BaseAPIResponse<
        Omit<User, 'password' | 'createdAt' | 'updatedAt' | 'deletedAt'>[]
      > = await response.json();

      if (!response.ok) {
        throw new Error('Something went wrong');
      }

      setUsers(data);
      return data; // Returning the fetched data
    } catch (error) {
      setError('Error fetching users');
      toast.error('Error fetching users');
      throw error; // Propagate the error
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    users,
    error,
    getAllUsers
  };
}

export function useCreateUser() {
  const [isLoading, setIsLoading] = useState(false);

  const createUser = async (
    userData: z.infer<typeof userFormSchemaDefault>
  ) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      toast.success(data.message);
      return data;
    } catch (error) {
      toast.error('Error creating user');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    createUser
  };
}

export function useGetUserById() {
  const [isLoading, setIsLoading] = useState(false);

  const getUserById = async (id: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/user/${id}`, {
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
        throw new Error(data.error || 'Something went wrong');
      }

      return data;
    } catch (error) {
      toast.error('Error fetching user');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    getUserById
  };
}

// update user
export function useUpdateUser() {
  const [isLoading, setIsLoading] = useState(false);

  const updateUser = async (
    id: string,
    userData: z.infer<typeof userFormSchemaDefault>
  ) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/user/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      toast.success(data.message);
      return data;
    } catch (error) {
      toast.error('Error updating user');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    updateUser
  };
}

// update user profile
export function useUpdateProfile() {
  const [isLoading, setIsLoading] = useState(false);

  const updateProfile = async (
    id: string,
    userData: {
      name: string;
      email: string;
      role: string;
      phone: string;
      gender: string;
      picture: string;
    }
  ) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/profile/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      toast.success(data.message);
      return data;
    } catch (error) {
      toast.error('Error updating profile');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    updateProfile
  };
}

export function useChangePassword() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>();

  const changePassword = async (
    userId: string,
    currentPassword: string,
    newPassword: string
  ) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/profile/${userId}/change-pass`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ currentPassword, newPassword })
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error.error || 'Something went wrong');
        throw new Error(data.error.error || 'Something went wrong');
      }

      toast.success(data.message);
      return data;
    } catch (error) {
      setError('Error changing password');
      toast.error('Error changing password');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    error,
    isLoading,
    changePassword
  };
}
