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
import { FileUploader } from '@/components/file-uploader';
import useUploadImage from '@/hooks/useUploadImage';
import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { CircleX } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import {
    useCreateBahan,
    useGetBahanById,
    useUpdateBahan
} from '@/hooks/useBahan';
import toast from 'react-hot-toast';

const MAX_FILE_SIZE = 5000000;
const ACCEPTED_IMAGE_TYPES = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp'
];

const formSchema = z.object({
    code: z.string().min(1, {
        message: 'Code is required'
    }),
    image: z.any().optional(),
    name: z.string().min(2, {
        message: 'Product name must be at least 2 characters.'
    }),
    description: z.string().min(10, {
        message: 'Description must be at least 10 characters.'
    })
});

export default function BahanForm() {
    const { imageUrl: upImageUrl, isUploading, uploadImage } = useUploadImage();
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const { Id } = useParams<{ Id: string }>();
    const router = useRouter();
    const isEdit = useMemo(() => {
        return Id !== undefined && Id !== 'create';
    }, [Id]);

    const { isLoading: isCreating, createBahan } = useCreateBahan();
    const { isLoading: isFetching, getBahanById } = useGetBahanById();
    const { isLoading: isUpdating, updateBahan } = useUpdateBahan();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            image: [],
            name: '',
            description: ''
        }
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            if (isEdit) {
                await updateBahan(Id, values, imageUrl || '');
                toast.success('Ukuran updated successfully');
                router.push('/dashboard/data/bahan');
                return;
            }
            await createBahan(values, imageUrl || '');
            toast.success('Ukuran created successfully');
            router.push('/dashboard/data/bahan');
        } catch (error) {
            // toast.error('Error creating or updating bahan');
        }
    }

    useEffect(() => {
        console.debug('id', Id);
        if (isEdit) {
            (async () => {
                try {
                    const bahanData = await getBahanById(Id);
                    form.reset(bahanData.data);
                    setImageUrl(bahanData.data.imageUrl);
                } catch (error) {
                    toast.error('Error fetching bahan data');
                    router.push('/dashboard/data/bahan');
                }
            })();
        }
    }, [Id]);

    async function uploadFiles(files: File[]): Promise<void> {
        await uploadImage(files[0]); // Pastikan uploadImage mengembalikan URL image
        form.setValue('image', files); // Memastikan bahwa field image diperbarui
    }

    useEffect(() => {
        if (upImageUrl) {
            setImageUrl(upImageUrl);
        }
    }, [upImageUrl]);

    return (
        <Card className="mx-auto w-full">
            <CardHeader>
                <CardTitle className="text-left text-2xl font-bold">
                    {isEdit ? 'Edit' : 'Tambah'}
                    Bahan
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
                                                                setImageUrl(
                                                                    null
                                                                );
                                                                form.setValue(
                                                                    'image',
                                                                    []
                                                                );
                                                            }}
                                                        >
                                                            <CircleX
                                                                size={24}
                                                                className="text-red-500"
                                                            />
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
                                                    onValueChange={
                                                        field.onChange
                                                    }
                                                    maxFiles={1}
                                                    maxSize={5 * 1024 * 1024}
                                                    onUpload={uploadFiles}
                                                    disabled={isUploading}
                                                    className={
                                                        imageUrl ? 'hidden' : ''
                                                    }
                                                />
                                            </>
                                        </FormControl>
                                        <FormMessage />
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
                                        <FormLabel>Code Bahan</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Masukkan code bahan"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Nama Bahan</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Masukkan nama bahan"
                                                {...field}
                                            />
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
                                                placeholder="Masukkan keterangan bahan"
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
