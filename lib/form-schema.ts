import * as z from 'zod';

// Schema
export const profileSchema = z.object({
    firstname: z
        .string()
        .min(3, { message: 'Product Name must be at least 3 characters' }),
    lastname: z
        .string()
        .min(3, { message: 'Product Name must be at least 3 characters' }),
    email: z
        .string()
        .email({ message: 'Product Name must be at least 3 characters' }),
    contactno: z.coerce.number(),
    country: z.string().min(1, { message: 'Please select a category' }),
    city: z.string().min(1, { message: 'Please select a category' }),
    // jobs array is for the dynamic fields
    jobs: z.array(
        z.object({
            jobcountry: z
                .string()
                .min(1, { message: 'Please select a category' }),
            jobcity: z.string().min(1, { message: 'Please select a category' }),
            jobtitle: z.string().min(3, {
                message: 'Product Name must be at least 3 characters'
            }),
            employer: z.string().min(3, {
                message: 'Product Name must be at least 3 characters'
            }),
            startdate: z
                .string()
                .refine((value) => /^\d{4}-\d{2}-\d{2}$/.test(value), {
                    message: 'Start date should be in the format YYYY-MM-DD'
                }),
            enddate: z
                .string()
                .refine((value) => /^\d{4}-\d{2}-\d{2}$/.test(value), {
                    message: 'End date should be in the format YYYY-MM-DD'
                })
        })
    )
});

export const orderSchema = z.object({
    title: z
        .string()
        .min(3, { message: 'Product Name must be at least 3 characters' }),
    description: z
        .string()
        .min(3, { message: 'Product Name must be at least 3 characters' }),
    mockup_link: z.string(),
    collar_link: z.string(),
    shared_drive_link: z.string(),
    total_price: z.string(),
    total_dp: z.string(),
    bahan: z.string(),
    // jobs array is for the dynamic fields
    sizes: z.array(
        z.object({
            ukuran: z.string().min(1, { message: 'Please select a category' }),
            jenis: z.string().min(1, { message: 'Please select a category' }),
            qty: z.string().min(1, { message: 'Please select a category' })
        })
    )
});

// Form Values
export type ProfileFormValues = z.infer<typeof profileSchema>;
export type OrderFormValues = z.infer<typeof orderSchema>;
