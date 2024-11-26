import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import CurrencyInput from '@/components/currency-input';
import Image from 'next/image';
import { orderFormDataType } from '@/hooks/useOrder';
import { BaseAPIResponse } from '@/types/common';
import { Bahan, Jenis, Shipment } from '@prisma/client';
import { useMemo } from 'react';
import { formatRupiah } from '@/lib/utils';
import InfoTooltip from '@/components/info-tooltip';
import SupabaseImageUploader from '@/components/supabase-image-uploader';

interface StepThreeProps {
  formData: orderFormDataType;
  setFormData: React.Dispatch<React.SetStateAction<orderFormDataType>>;
  errors: Partial<Record<string, string>>;
  shipments?: BaseAPIResponse<
    Omit<Shipment, 'createdAt' | 'updatedAt' | 'deletedAt'>[]
  >;
  bahan?: BaseAPIResponse<
    Omit<Bahan, 'createdAt' | 'updatedAt' | 'deletedAt'>[]
  >;
  jenisData: Jenis[];
  handlePrevStep: () => void;
  handleSubmit: (e: React.FormEvent) => void;
  isCreating: boolean;
  isFetching: boolean;
  isUpdating: boolean;
  isEdit: boolean;
}

export default function StepThree({
  formData,
  setFormData,
  errors,
  shipments,
  jenisData,
  handlePrevStep,
  handleSubmit,
  isCreating,
  isFetching,
  isUpdating,
  isEdit
}: StepThreeProps) {
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const totalQuantity = useMemo(() => {
    return formData.orderDetails.reduce((acc, item) => acc + item.quantity, 0);
  }, [formData.orderDetails]);

  const selectedJenis = useMemo(() => {
    return jenisData.find((jenis: Jenis) => jenis.code === formData.jenisCode);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.jenisCode]);

  function handleImageUploaded(url: string, key: string): void {
    setFormData((prevData) => ({
      ...prevData,
      [key]: url
    }));
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-5">
        <div className="flex flex-col gap-3">
          <p>Total Pesanan</p>
          <p className="text-4xl font-semibold">
            {formatRupiah(formData.totalAmount)}
          </p>
          <p className="text-sm italic opacity-45">
            {selectedJenis?.name} x {totalQuantity}pcs
          </p>
        </div>
        <div className="flex flex-col gap-3">
          <div className="flex items-start gap-3">
            <p>Total DP</p>
            <InfoTooltip
              message="Total DP yang dibayarkan oleh pelanggan minimal 50% dari total pesanan, transfer ke rekening bank yang tertera."
              size="small"
            />
          </div>
          <CurrencyInput
            name="dpAmount"
            value={formData.dpAmount.toString()}
            onChange={handleChange}
            placeholder="Masukan Total DP"
          />
          {errors.dpAmount && (
            <p className="text-sm text-red-500">{errors.dpAmount}</p>
          )}
        </div>

        <div className="space-y-3">
          <p>Pilih Pengiriman</p>
          <Select
            value={formData.shipmentCode}
            onValueChange={(value) => {
              setFormData((prevData) => ({
                ...prevData,
                shipmentCode: value
              }));
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Pilih Pengiriman" />
            </SelectTrigger>
            <SelectContent>
              {shipments &&
                shipments.data?.map((shipment) => (
                  <SelectItem key={shipment.code} value={shipment.code}>
                    <div className="flex items-center gap-3">
                      <Image
                        src={shipment.logo || '/images/placeholder.png'}
                        alt={shipment.title}
                        width={300}
                        height={100}
                        className="aspect-[5/3] h-8 w-auto object-cover"
                      />
                      {shipment.title}
                    </div>
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
          {errors.shipmentCode && (
            <p className="text-sm text-red-500">{errors.shipmentCode}</p>
          )}
        </div>
      </div>

      <SupabaseImageUploader
        name="Bukti Transfer"
        initialUrl={formData.proofDp}
        onUpload={(url) => handleImageUploaded(url, 'proofDp')}
        errMessage={errors.proofDp}
        imageClass="max-h-[500px] w-max mx-auto"
      />

      <div className="grid grid-cols-2 gap-3">
        <Button onClick={handlePrevStep} type="button" className="mt-3">
          Back
        </Button>
        <Button type="submit" className="mt-3">
          {isCreating || isFetching || isUpdating
            ? 'Loading...'
            : isEdit
            ? 'Update'
            : 'Buat Pesanan'}
        </Button>
      </div>
    </>
  );
}
