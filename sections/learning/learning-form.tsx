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
    useCreateLearning,
    useGetLearningById,
    useUpdateLearning,
    learningFormSchemaDefault
} from '@/hooks/useLearning';
import { Textarea } from '@/components/ui/textarea';
import SupabaseImageUploader from '@/components/supabase-image-uploader';

export default function LearningForm() {
    const { Id } = useParams<{ Id: string }>();
    const isEdit = useMemo(() => Id !== undefined && Id !== 'create', [Id]);

    const { isLoading: isCreating, createLearning } = useCreateLearning();
    const { isLoading: isFetching, getLearningById } = useGetLearningById();
    const { isLoading: isUpdating, updateLearning } = useUpdateLearning();

    const form = useForm<z.infer<typeof learningFormSchemaDefault>>({
        resolver: zodResolver(learningFormSchemaDefault),
        defaultValues: {
            name: '',
            source: '',
            description: ''
        }
    });

    const router = useRouter();

    useEffect(() => {
        if (isEdit) {
            (async () => {
                try {
                    const learningData = await getLearningById(Id);
                    form.reset(learningData.data);
                } catch (error) {
                    toast.error('Error fetching learning data');
                    router.push('/dashboard/data/pembelajaran');
                }
            })();
        }
    }, [Id]);

    async function onSubmit(values: z.infer<typeof learningFormSchemaDefault>) {
        try {
            if (isEdit) {
                await updateLearning(Id, values);
                toast.success('Learning updated successfully');
            } else {
                await createLearning(values);
                toast.success('Learning created successfully');
            }
            router.push('/dashboard/data/pembelajaran');
        } catch (error) {
            toast.error('Error creating or updating learning');
        }
    }

    return (
        <Card className="mx-auto w-full">
            <CardHeader>
                <CardTitle className="text-left text-2xl font-bold">
                    {isEdit ? 'Edit' : 'Create'} Learning
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
                                name="thumbnail"
                                render={({ field }) => (
                                    <FormItem>
                                        <SupabaseImageUploader
                                            name="Thumbnail"
                                            initialUrl={field.value}
                                            onUpload={(url) =>
                                                form.setValue('thumbnail', url)
                                            }
                                            errMessage={
                                                form.formState.errors.thumbnail
                                                    ?.message
                                            }
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
                                            <Input
                                                placeholder="Enter learning name"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="source"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Source</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Enter source"
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
