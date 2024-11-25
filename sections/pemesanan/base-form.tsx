'use client';

import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription
} from '@/components/ui/card';
import { useParams, useRouter } from 'next/navigation';
import {
  orderFormDataType,
  useCreateOrder,
  useGetOrderById,
  useUpdateOrder
} from '@/hooks/useOrder';
import toast from 'react-hot-toast';
import { useGetAllBahan } from '@/hooks/useBahan';
import { useSession } from 'next-auth/react';
import SupabaseImageUploader from '@/components/supabase-image-uploader';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { useGetAllJenis } from '@/hooks/useJenis';
import { useGetAllUkuran } from '@/hooks/useUkuran';
import { CircleX } from 'lucide-react';
import CurrencyInput from '@/components/currency-input';

export default function OrderForm() {
  const { Id } = useParams<{ Id: string }>();
  const router = useRouter();
  const isEdit = useMemo(() => Id !== undefined && Id !== 'create', [Id]);
  const [step, setStep] = useState(1);
  const session = useSession();
  const { bahan, getAllBahan } = useGetAllBahan();
  const { jenisData, getAllJenis } = useGetAllJenis();
  const { ukuran, getAllUkuran } = useGetAllUkuran();

  const { isLoading: isCreating, createOrder } = useCreateOrder();
  const { isLoading: isFetching, getOrderById } = useGetOrderById();
  const { isLoading: isUpdating, updateOrder } = useUpdateOrder();

  const [formData, setFormData] = useState<orderFormDataType>({
    invoiceId: '',
    title: '',
    description: '',
    linkMockup: '',
    linkCollar: '',
    linkLayout: '',
    linkSharedrive: '',
    startAt: '',
    finishAt: '',
    totalAmount: 0,
    dpAmount: 0,
    settlementAmount: 0,
    bahanCode: '',
    createdBy: '',
    jenisCode: '',
    orderDetails: [{ quantity: 0, ukuranId: '' }]
  });
  const [errors, setErrors] = useState<
    Partial<
      Record<
        | keyof orderFormDataType
        | `orderDetails[${number}].quantity`
        | `orderDetails[${number}].ukuranId`,
        string
      >
    >
  >({});

  const validateStep1 = () => {
    const newErrors: Partial<Record<keyof orderFormDataType, string>> = {};
    if (!formData.title) newErrors.title = 'Title is required';
    if (!formData.linkMockup) newErrors.linkMockup = 'Foto Mockup is required';
    if (!formData.linkCollar) newErrors.linkCollar = 'Foto Collar is required';
    if (!formData.linkLayout) newErrors.linkLayout = 'Foto Layout is required';
    if (!formData.linkSharedrive)
      newErrors.linkSharedrive = 'Link Sharedrive is required';
    // if (!formData.startAt) newErrors.startAt = 'Start At is required';
    // if (!formData.finishAt) newErrors.finishAt = 'Finish At is required';
    // if (!formData.totalAmount)
    //   newErrors.totalAmount = 'Total Amount is required';
    // if (!formData.dpAmount) newErrors.dpAmount = 'DP Amount is required';
    // if (formData.dpAmount > formData.totalAmount)
    //   newErrors.dpAmount = 'DP Amount must be less than Total Amount';
    if (!formData.bahanCode) newErrors.bahanCode = 'Bahan is required';
    if (!formData.jenisCode) newErrors.jenisCode = 'Jenis is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors: Partial<Record<string, string>> = {};
    formData.orderDetails.forEach((orderDetail, index) => {
      if (orderDetail.quantity <= 0) {
        newErrors[`orderDetails[${index}].quantity`] =
          'Quantity harus lebih dari 0';
      }
      if (!orderDetail.ukuranId) {
        newErrors[`orderDetails[${index}].ukuranId`] = 'Ukuran is required';
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (step === 1) {
      if (validateStep1()) {
        setStep(2);
      }
    }
  };

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

  const handleImageUploaded = (imgUrl: string, field: string) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: imgUrl
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep2()) return;

    const totalAmountParse = parseInt(
      formData.totalAmount.toString().replace(/\D/g, '')
    );
    const dpAmountParse = parseInt(
      formData.dpAmount.toString().replace(/\D/g, '')
    );

    const payload = {
      ...formData,
      totalAmount: Number(totalAmountParse),
      dpAmount: Number(dpAmountParse),
      startAt: new Date(formData.startAt).toISOString(),
      finishAt: new Date(formData.finishAt).toISOString()
    };

    try {
      if (isEdit) {
        await updateOrder(Id, payload);
        toast.success('Order updated successfully');
        router.push('/dashboard/pemesanan');
        return;
      }
      await createOrder(payload);
      toast.success('Order created successfully');
      router.push('/dashboard/pemesanan');
    } catch (error) {
      toast.error('Error creating or updating order');
    }
  };

  useEffect(() => {
    if (isEdit && Id && bahan?.data && jenisData) {
      (async () => {
        try {
          const orderData = await getOrderById(Id);
          setFormData(orderData.data);
        } catch (error) {
          toast.error('Error fetching order data');
          // router.push('/dashboard/data/order');
        }
      })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Id, bahan, jenisData]);

  useEffect(() => {
    if (session?.data?.user?.id) {
      setFormData((prevData) => ({
        ...prevData,
        createdBy: session.data.user.id
      }));
    }
  }, [session]);

  useEffect(() => {
    // Fetch all bahan, jenis, and ukuran data
    getAllBahan({});
    getAllJenis({});
    getAllUkuran({});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Card className="mx-auto w-full">
      <CardHeader>
        <CardTitle className="text-left text-2xl font-bold">
          {isEdit ? 'Edit' : 'Tambahkan'} Pesanan Anda
        </CardTitle>
        <CardDescription className="text-left">
          Silahkan atur data pesanan anda.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-3 max-md:grid-cols-1">
          <div
            className={`border-b-4 pb-3 ${
              step == 1 ? 'border-orange-500' : ''
            }`}
          >
            <div className="text-xs font-semibold text-orange-500">Step 1</div>
            <div className="text-md">Informasi Dasar</div>
          </div>
          <div
            className={`border-b-4 pb-3 ${
              step == 2 ? 'border-orange-500' : ''
            }`}
          >
            <div className="text-xs font-semibold text-orange-500">Step 2 </div>
            <div className="text-md">Ukuran</div>
          </div>
          <div
            className={`border-b-4 pb-3 ${
              step == 3 ? 'border-orange-500' : ''
            }`}
          >
            <div className="text-xs font-semibold text-orange-500">Step 3 </div>
            <div className="text-md">Biaya</div>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-5 py-5">
          {step === 1 && (
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
          )}

          {step === 2 && (
            <>
              <div className="flex flex-col gap-5">
                {formData.orderDetails.map((orderDetail, index) => (
                  <div
                    key={index}
                    className="relative grid grid-cols-2 gap-3 rounded-md border-2 p-3"
                  >
                    {index !== 0 && (
                      <div
                        className="absolute -right-3 -top-3 cursor-pointer rounded-full bg-white p-1 text-red-500"
                        onClick={() =>
                          setFormData((prevData) => {
                            const newOrderDetails = [...prevData.orderDetails];
                            newOrderDetails.splice(index, 1);
                            return {
                              ...prevData,
                              orderDetails: newOrderDetails
                            };
                          })
                        }
                      >
                        <CircleX />
                      </div>
                    )}

                    <div className="">
                      <p>Ukuran</p>
                      <Select
                        value={orderDetail.ukuranId}
                        onValueChange={(value) =>
                          setFormData((prevData) => {
                            const newOrderDetails = [...prevData.orderDetails];
                            newOrderDetails[index].ukuranId = value;
                            return {
                              ...prevData,
                              orderDetails: newOrderDetails
                            };
                          })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih Ukuran" />
                        </SelectTrigger>
                        <SelectContent>
                          {ukuran?.data?.map((ukuran) => (
                            <SelectItem key={ukuran.id} value={ukuran.id}>
                              {ukuran.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors[`orderDetails[${index}].ukuranId`] && (
                        <span className="text-xs text-red-500">
                          {errors[`orderDetails[${index}].ukuranId`]}
                        </span>
                      )}
                    </div>

                    <div className="">
                      <p>Jumlah</p>
                      <Input
                        type="text"
                        value={orderDetail.quantity}
                        onChange={(e) =>
                          setFormData((prevData) => {
                            const newOrderDetails = [...prevData.orderDetails];
                            newOrderDetails[index].quantity = Number(
                              e.target.value
                            );
                            return {
                              ...prevData,
                              orderDetails: newOrderDetails
                            };
                          })
                        }
                        onKeyPress={(e) => {
                          if (!/[0-9]/.test(e.key)) {
                            e.preventDefault();
                          }
                        }}
                      />
                      {errors[`orderDetails[${index}].quantity`] && (
                        <span className="text-xs text-red-500">
                          {errors[`orderDetails[${index}].quantity`]}
                        </span>
                      )}
                    </div>
                  </div>
                ))}

                <Button
                  onClick={() =>
                    setFormData((prevData) => ({
                      ...prevData,
                      orderDetails: [
                        ...prevData.orderDetails,
                        { quantity: 0, ukuranId: '' }
                      ]
                    }))
                  }
                  type="button"
                  className="mt-3"
                >
                  Tambah Ukuran
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  onClick={() => setStep(1)}
                  type="button"
                  className="mt-3"
                >
                  Back
                </Button>
                <Button
                  onClick={() => setStep(3)}
                  type="button"
                  className="mt-3"
                >
                  Next
                </Button>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <div className="grid grid-cols-2 gap-5">
                <div className="flex flex-col gap-3">
                  <p>Mulai Pesanan</p>
                  <Input
                    name="startAt"
                    value={formData.startAt}
                    onChange={handleChange}
                    placeholder="Start At"
                    type="date"
                  />
                  {errors.startAt && (
                    <p className="text-sm text-red-500">{errors.startAt}</p>
                  )}
                </div>
                <div className="flex flex-col gap-3">
                  <p>Selesai Pesanan</p>
                  <Input
                    name="finishAt"
                    value={formData.finishAt}
                    onChange={handleChange}
                    placeholder="Finish At"
                    type="date"
                  />
                  {errors.finishAt && (
                    <p className="text-sm text-red-500">{errors.finishAt}</p>
                  )}
                </div>
                <div className="flex flex-col gap-3">
                  <p>Total Pesanan</p>
                  <CurrencyInput
                    name="totalAmount"
                    value={formData.totalAmount.toString()}
                    onChange={handleChange}
                    placeholder="Masukan Total Pesanan"
                  />
                  {errors.totalAmount && (
                    <p className="text-sm text-red-500">{errors.totalAmount}</p>
                  )}
                </div>
                <div className="flex flex-col gap-3">
                  <p>Total DP</p>
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
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  onClick={() => setStep(2)}
                  type="button"
                  className="mt-3"
                >
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
          )}
        </form>
      </CardContent>
    </Card>
  );
}
