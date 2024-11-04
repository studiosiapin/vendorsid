'use client';

import { useEffect, useMemo, useState } from 'react';
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
import { useParams, useRouter } from 'next/navigation';
import {
  useCreateJenis,
  useGetJenisById,
  useUpdateJenis
} from '@/hooks/useJenis';
import toast from 'react-hot-toast';
import useUploadImage from '@/hooks/useUploadImage';
import { FileUploader } from '@/components/file-uploader';
import { CircleX } from 'lucide-react';
import Image from 'next/image';

const formSchema = z.object({
  image: z.any().optional(),
  name: z.string().min(2, {
    message: 'Name must be at least 2 characters.'
  }),
  description: z
    .string()
    .min(10, {
      message: 'Description must be at least 10 characters.'
    })
    .optional()
});

export default function JenisForm() {
  const { Id } = useParams<{ Id: string }>();
  const router = useRouter();
  const isEdit = useMemo(() => Id !== undefined && Id !== 'create', [Id]);
  const { imageUrl: upImageUrl, isUploading, uploadImage } = useUploadImage();
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const { isLoading: isCreating, createJenis } = useCreateJenis();
  const { isLoading: isFetching, getJenisById } = useGetJenisById();
  const { isLoading: isUpdating, updateJenis } = useUpdateJenis();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: ''
    }
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      if (isEdit) {
        await updateJenis(Id, values, imageUrl || '');
        toast.success('Jenis updated successfully');
      } else {
        await createJenis(values, imageUrl || '');
        toast.success('Jenis created successfully');
      }
      router.push('/dashboard/data/jenis'); // Redirect after successful operation
    } catch (error) {
      toast.error('Error creating or updating jenis');
    }
  }

  async function uploadFiles(files: File[]): Promise<void> {
    await uploadImage(files[0]); // Pastikan uploadImage mengembalikan URL image
    form.setValue('image', files); // Memastikan bahwa field image diperbarui
  }

  useEffect(() => {
    if (upImageUrl) {
      setImageUrl(upImageUrl);
    }
  }, [upImageUrl]);

  useEffect(() => {
    if (isEdit) {
      (async () => {
        try {
          const jenisData = await getJenisById(Id);
          form.reset(jenisData.data);
          setImageUrl(jenisData.data.imageUrl);
        } catch (error) {
          toast.error('Error fetching jenis data');
          router.push('/dashboard/data/jenis'); // Redirect on error
        }
      })();
    }
  }, [Id]);

  return (
    <Card className="mx-auto w-full">
      <CardHeader>
        <CardTitle className="text-left text-2xl font-bold">
          {isEdit ? 'Edit' : 'Tambah'} Jenis
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
              name="image"
              render={({ field }) => (
                <div className="">
                  <FormItem className="w-full">
                    <FormLabel>Gambar</FormLabel>
                    <FormControl>
                      <>
                        {imageUrl && (
                          <div className="relative">
                            <div
                              className="absolute right-1 top-1 cursor-pointer rounded-full bg-white p-1"
                              onClick={() => {
                                setImageUrl(null);
                                form.setValue('image', []);
                              }}
                            >
                              <CircleX size={24} className="text-red-500" />
                            </div>
                            <Image
                              src={imageUrl}
                              width={200}
                              height={200}
                              alt=""
                              className="w-full"
                            />
                          </div>
                        )}
                        <FileUploader
                          value={field.value}
                          onValueChange={field.onChange}
                          maxFiles={1}
                          maxSize={5 * 1024 * 1024}
                          onUpload={uploadFiles}
                          disabled={isUploading}
                          className={imageUrl ? 'hidden' : ''}
                        />
                      </>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </div>
              )}
            />
            <div className="flex flex-col gap-5">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter name" {...field} />
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
                      <Textarea
                        placeholder="Enter a description"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="mt-3"
                disabled={isCreating || isFetching || isUpdating}
              >
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
