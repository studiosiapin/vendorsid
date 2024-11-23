'use client';

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
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useEffect, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  useCreateShipment,
  useGetShipmentById,
  useUpdateShipment
} from '@/hooks/useShipment';
import toast from 'react-hot-toast';
import SupabaseImageUploader from '@/components/supabase-image-uploader';

const formSchema = z.object({
  code: z.string().min(1, {
    message: 'Code is required'
  }),
  logo: z.string().min(1, {
    message: 'Logo is required'
  }),
  title: z.string().min(2, {
    message: 'Product title must be at least 2 characters.'
  }),
  description: z.string().min(10, {
    message: 'Description must be at least 10 characters.'
  })
});

export default function ShipmentForm() {
  const { Id } = useParams<{ Id: string }>();
  const router = useRouter();
  const isEdit = useMemo(() => {
    return Id !== undefined && Id !== 'create';
  }, [Id]);

  const { isLoading: isCreating, createShipment } = useCreateShipment();
  const { isLoading: isFetching, getShipmentById } = useGetShipmentById();
  const { isLoading: isUpdating, updateShipment } = useUpdateShipment();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: '',
      logo: '',
      title: '',
      description: ''
    }
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      if (isEdit) {
        await updateShipment(Id, values);
        toast.success('Ukuran updated successfully');
        router.push('/dashboard/data/shipment');
        return;
      }
      await createShipment(values);
      toast.success('Ukuran created successfully');
      router.push('/dashboard/data/shipment');
    } catch (error) {
      // toast.error('Error creating or updating shipment');
    }
  }

  useEffect(() => {
    if (isEdit) {
      (async () => {
        try {
          const shipmentData = await getShipmentById(Id);
          form.reset(shipmentData.data);
        } catch (error) {
          toast.error('Error fetching shipment data');
          router.push('/dashboard/data/shipment');
        }
      })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Id]);

  return (
    <Card className="mx-auto w-full">
      <CardHeader>
        <CardTitle className="text-left text-2xl font-bold">
          {isEdit ? 'Edit' : 'Tambah'}
          Shipment
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid grid-cols-2 gap-5"
          >
            <FormField
              control={form.control}
              name="logo"
              render={({ field }) => (
                <div className="">
                  <FormItem>
                    <SupabaseImageUploader
                      name="Logo"
                      initialUrl={field.value}
                      onUpload={(url) => form.setValue('logo', url)}
                      errMessage={form.formState.errors.logo?.message}
                    />
                  </FormItem>
                </div>
              )}
            />

            <div className="flex flex-col gap-3">
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Code Shipment</FormLabel>
                    <FormControl>
                      <Input placeholder="Masukkan code shipment" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title Shipment</FormLabel>
                    <FormControl>
                      <Input placeholder="Masukkan title shipment" {...field} />
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
                    <FormLabel>Keterangan</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Masukkan keterangan shipment"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="mt-3">
                {isCreating || isFetching || isUpdating
                  ? 'Loading...'
                  : isEdit
                  ? 'Update'
                  : 'Tambah'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
