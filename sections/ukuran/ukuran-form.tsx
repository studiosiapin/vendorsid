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
    useCreateUkuran,
    useGetUkuranById,
    useUpdateUkuran
} from '@/hooks/useUkuran';
import { Textarea } from '@/components/ui/textarea';

export const ukuranFormSchema = z.object({
    code: z.string().min(1, 'Code is required'),
    name: z.string().min(1, 'Name is required'),
    description: z.string().optional()
});

export default function UkuranForm() {
    const { Id } = useParams<{ Id: string }>();
    const isEdit = useMemo(() => {
        return Id !== undefined && Id !== 'create';
    }, [Id]);

    const { isLoading: isCreating, createUkuran } = useCreateUkuran();
    const { isLoading: isFetching, getUkuranById } = useGetUkuranById();
    const { isLoading: isUpdating, updateUkuran } = useUpdateUkuran();

    const form = useForm<z.infer<typeof ukuranFormSchema>>({
        resolver: zodResolver(ukuranFormSchema),
        defaultValues: {
            name: '',
            description: ''
        }
    });

    const router = useRouter();

    useEffect(() => {
        if (isEdit) {
            (async () => {
                try {
                    const ukuransData = await getUkuranById(Id);
                    form.reset(ukuransData.data);
                } catch (error) {
                    toast.error('Error fetching ukuran data');
                    router.push('/dashboard/data/ukuran');
                }
            })();
        }
    }, [Id]);

    async function onSubmit(values: z.infer<typeof ukuranFormSchema>) {
        try {
            if (isEdit) {
                await updateUkuran(Id, values);
                toast.success('Ukuran updated successfully');
                router.push('/dashboard/data/ukuran');
                return;
            }
            await createUkuran(values);
            toast.success('Ukuran created successfully');
            router.push('/dashboard/data/ukuran');
        } catch (error) {
            toast.error('Error creating or updating ukuran');
        }
    }

    return (
        <Card className="mx-auto w-full">
            <CardHeader>
                <CardTitle className="text-left text-2xl font-bold">
                    {isEdit ? 'Edit' : 'Create'} Ukuran
                </CardTitle>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-8"
                    >
                        <div className="space-y-6">
                            <FormField
                                control={form.control}
                                name="code"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Code</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Enter size code"
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
                                        <FormLabel>Name</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Enter size name"
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
                                        <FormLabel>Description</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Enter a description"
                                                {...field}
                                            />
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
