import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import SupabaseImageUploader from '@/components/supabase-image-uploader';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';
import { orderFormDataType } from '@/hooks/useOrder';
import { BaseAPIResponse } from '@/types/common';
import { Bahan } from '@prisma/client';

interface StepOneProps {
    formData: orderFormDataType;
    handleChange: (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
    ) => void;
    handleImageUploaded: (imgUrl: string, field: string) => void;
    handleNextStep: () => void;
    errors: Partial<Record<keyof orderFormDataType, string>>;
    bahan?: BaseAPIResponse<
        Omit<Bahan, 'createdAt' | 'updatedAt' | 'deletedAt'>[]
    >;
    jenisData: { code: string; name: string }[];
    setFormData: React.Dispatch<React.SetStateAction<orderFormDataType>>;
}

export default function StepOne({
    formData,
    handleChange,
    handleImageUploaded,
    handleNextStep,
    errors,
    bahan,
    jenisData,
    setFormData
}: StepOneProps) {
    return (
        <div className="flex flex-col gap-3">
            <p>Judul Pesanan</p>
            <Input
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Title"
            />
            {errors.title && (
                <p className="text-sm text-red-500">{errors.title}</p>
            )}

            <p>Deskripsi Pesanan</p>
            <Textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Description"
            />

            <div className="grid grid-cols-3 gap-3 max-md:grid-cols-1">
                <SupabaseImageUploader
                    name="Foto Mockup"
                    initialUrl={formData.linkMockup}
                    onUpload={(url) => handleImageUploaded(url, 'linkMockup')}
                    errMessage={errors.linkMockup}
                />
                <SupabaseImageUploader
                    name="Foto Collar"
                    initialUrl={formData.linkCollar}
                    onUpload={(url) => handleImageUploaded(url, 'linkCollar')}
                    errMessage={errors.linkCollar}
                />
                <SupabaseImageUploader
                    name="Foto Layout"
                    initialUrl={formData.linkLayout}
                    onUpload={(url) => handleImageUploaded(url, 'linkLayout')}
                    errMessage={errors.linkLayout}
                />
            </div>

            <p>Link Sharedrive</p>
            <Input
                name="linkSharedrive"
                value={formData.linkSharedrive}
                onChange={handleChange}
                placeholder="Link Sharedrive"
            />
            {errors.linkSharedrive && (
                <p className="text-sm text-red-500">{errors.linkSharedrive}</p>
            )}

            <p>Pilih Bahan</p>
            <Select
                value={formData.bahanCode}
                onValueChange={(value) => {
                    setFormData((prevData) => ({
                        ...prevData,
                        bahanCode: value
                    }));
                }}
            >
                <SelectTrigger>
                    <SelectValue placeholder="Pilih Bahan" />
                </SelectTrigger>
                <SelectContent>
                    {bahan?.data?.map((bahan) => (
                        <SelectItem key={bahan.code} value={bahan.code}>
                            {bahan.name}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
            {errors.bahanCode && (
                <p className="text-sm text-red-500">{errors.bahanCode}</p>
            )}

            <p>Pilih Jenis</p>
            <Select
                value={formData.jenisCode}
                onValueChange={(value) =>
                    setFormData((prevData) => ({
                        ...prevData,
                        jenisCode: value
                    }))
                }
            >
                <SelectTrigger>
                    <SelectValue placeholder="Pilih Jenis" />
                </SelectTrigger>
                <SelectContent>
                    {jenisData?.map((jenis) => (
                        <SelectItem key={jenis.code} value={jenis.code}>
                            {jenis.name}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
            {errors.jenisCode && (
                <p className="text-sm text-red-500">{errors.jenisCode}</p>
            )}

            <div className="col-span-2 flex flex-col gap-3">
                <Button
                    onClick={() => handleNextStep()}
                    type="button"
                    className="mt-3"
                >
                    Next
                </Button>
            </div>
        </div>
    );
}
