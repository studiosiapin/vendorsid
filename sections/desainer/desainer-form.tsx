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
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { useParams, useRouter } from 'next/navigation';
import {
  useCreateDesainer,
  useGetDesainerById,
  useUpdateDesainer
} from '@/hooks/useDesainer';
import { Textarea } from '@/components/ui/textarea';
import SupabaseImageUploader from '@/components/supabase-image-uploader';

export const desainerFormSchema = z.object({
  imageUrl: z.string().min(1, 'Profile picture is required'),
  name: z.string().min(1, 'Name is required'),
  phone: z.string().optional(),
  portofolio: z.string().optional(),
  description: z.string().optional()
});

export default function DesainerForm() {
  const { Id } = useParams<{ Id: string }>();
  const isEdit = useMemo(() => {
    return Id !== undefined && Id !== 'create';
  }, [Id]);

  const { isLoading: isCreating, createDesainer } = useCreateDesainer();
  const { isLoading: isFetching, getDesainerById } = useGetDesainerById();
  const { isLoading: isUpdating, updateDesainer } = useUpdateDesainer();

  const form = useForm<z.infer<typeof desainerFormSchema>>({
    resolver: zodResolver(desainerFormSchema),
    defaultValues: {
      name: '',
      phone: '',
      portofolio: '',
      description: ''
    }
  });

  const router = useRouter();

  useEffect(() => {
    if (isEdit) {
      (async () => {
        try {
          const desainerData = await getDesainerById(Id);
          form.reset(desainerData.data);
        } catch (error) {
          toast.error('Error fetching desainer data');
          router.push('/dashboard/data/desainer');
        }
      })();
    }
  }, [Id]);

  async function onSubmit(values: z.infer<typeof desainerFormSchema>) {
    try {
      if (isEdit) {
        await updateDesainer(Id, values);
        toast.success('Desainer updated successfully');
        router.push('/dashboard/data/desainer');
        return;
      }
      await createDesainer(values);
      toast.success('Desainer created successfully');
      router.push('/dashboard/data/desainer');
    } catch (error) {
      toast.error('Error creating or updating desainer');
    }
  }

  return (
    <Card className="mx-auto w-full">
      <CardHeader>
        <CardTitle className="text-left text-2xl font-bold">
          {isEdit ? 'Edit' : 'Create'} Desainer
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-6">
              <FormField
                control={form.control}
                name="imageUrl"
                render={({ field }) => (
                  <FormItem>
                    <SupabaseImageUploader
                      initialUrl={field.value}
                      onUpload={(url) => form.setValue('imageUrl', url)}
                      errMessage={form.formState.errors.imageUrl?.message}
                      name="Profile Picture"
                      imageClass="rounded-full bg-zinc-200 w-20 h-20 object-cover"
                    />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter designer name" {...field} />
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
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter phone number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="portofolio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Portfolio</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter portfolio URL" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Enter a description" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

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
