import { z } from 'zod';

export type userDataType = {
  name: string;
  role: string;
  email: string;
  password?: string;
  phone?: string;
  gender: string;
};

export const userFormSchemaDefault = z
  .object({
    name: z.string().min(2, {
      message: 'Name must be at least 2 characters.'
    }),
    role: z.string().min(2, {
      message: 'Role must be selected.'
    }),
    email: z.string().email({
      message: 'Please enter a valid email address.'
    }),
    password: z.string().min(6, {
      message: 'Password must be at least 6 characters.'
    }),
    confirmPassword: z.string().min(6, {
      message: 'Confirm Password must be at least 6 characters.'
    }),
    phone: z.string().optional(), // Assuming phone is optional
    gender: z.enum(['male', 'female'], {
      required_error: 'Please select a gender.'
    })
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword']
  });

export const baseUserFormSchema = z.object({
  name: z.string().min(2, {
    message: 'Name must be at least 2 characters.'
  }),
  role: z.string().min(2, {
    message: 'Role must be selected.'
  }),
  email: z.string().email({
    message: 'Please enter a valid email address.'
  }),
  phone: z.string().optional(), // Assuming phone is optional
  gender: z.enum(['male', 'female'], {
    required_error: 'Please select a gender.'
  })
});
