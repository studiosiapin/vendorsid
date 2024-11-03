'use client';

import { useMemo, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { useParams, useRouter } from 'next/navigation';
import { useCreateUser, useGetUserById, useUpdateUser } from '@/hooks/useUser';
import {
  baseUserFormSchema,
  userFormSchemaDefault
} from '@/types/schema/userFormSchema';

export default function EmployeeForm() {
  const { employeeId } = useParams<{ employeeId: string }>();
  const isEdit = useMemo(() => {
    return employeeId !== undefined && employeeId !== 'new';
  }, [employeeId]);
  const { isLoading: isCreating, createUser } = useCreateUser();
  const { isLoading: isFetching, getUserById } = useGetUserById();
  const { isLoading: isUpdating, updateUser } = useUpdateUser();

  const userFormSchema = useMemo(() => {
    return baseUserFormSchema
      .extend({
        password: isEdit
          ? z
              .string()
              .min(6, {
                message: 'Password must be at least 6 characters.'
              })
              .optional()
          : z.string().min(6, {
              message: 'Password must be at least 6 characters.'
            }),
        confirmPassword: isEdit
          ? z
              .string()
              .min(6, {
                message: 'Confirm Password must be at least 6 characters.'
              })
              .optional()
          : z.string().min(6, {
              message: 'Confirm Password must be at least 6 characters.'
            })
      })
      .refine((data) => data.password === data.confirmPassword, {
        message: 'Passwords do not match',
        path: ['confirmPassword']
      });
  }, [isEdit]);

  const form = useForm<z.infer<typeof userFormSchema>>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      name: '',
      role: '',
      email: '',
      password: '',
      confirmPassword: '',
      phone: '',
      gender: undefined
    }
  });

  const router = useRouter();

  useEffect(() => {
    if (isEdit) {
      (async () => {
        try {
          const userData = await getUserById(employeeId);
          form.reset(userData.data);
        } catch (error) {
          toast.error('Error fetching user data');
          router.push('/dashboard/employee');
        }
      })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [employeeId]);

  async function onSubmit(values: z.infer<typeof userFormSchema>) {
    try {
      if (isEdit) {
        await updateUser(
          employeeId,
          values as z.infer<typeof userFormSchemaDefault>
        );
        toast.success('User updated successfully');
        router.push('/dashboard/employee');
        return;
      }
      await createUser(values as z.infer<typeof userFormSchemaDefault>);
      toast.success('User created successfully');
      router.push('/dashboard/employee');
    } catch (error) {
      toast.error('Error creating user');
    }
  }

  return (
    <Card className="mx-auto w-full">
      <CardHeader>
        <CardTitle className="text-left text-2xl font-bold">
          {isEdit && 'Edit'} Employee Information
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="super_admin">Super Admin</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="reseller">Reseller</SelectItem>
                        <SelectItem value="design_setting">
                          Design Setting
                        </SelectItem>
                        <SelectItem value="printing">Printing</SelectItem>
                        <SelectItem value="pressing">Pressing</SelectItem>
                        <SelectItem value="sewering">Sewering</SelectItem>
                        <SelectItem value="finishing">Finishing</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Enter your email"
                        autoComplete="off"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>No Whatsapp</FormLabel>
                    <FormControl>
                      <Input placeholder="Masukkan nomor Whatsapp" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Enter your password"
                        autoComplete="off"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Confirm your password"
                        autoComplete="off"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Gender</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      value={field.value}
                      className="flex space-x-4"
                    >
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <RadioGroupItem value="male" />
                        </FormControl>
                        <FormLabel className="font-normal">Male</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <RadioGroupItem value="female" />
                        </FormControl>
                        <FormLabel className="font-normal">Female</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              disabled={isCreating || isFetching || isUpdating}
            >
              {isCreating || isFetching || isUpdating
                ? 'Loading...'
                : isEdit
                ? 'Update'
                : 'Create'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
