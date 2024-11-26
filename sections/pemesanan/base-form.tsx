'use client';

import { useState, useEffect, useMemo } from 'react';
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
import { useGetAllJenis } from '@/hooks/useJenis';
import { useGetAllUkuran } from '@/hooks/useUkuran';
import { useGetAllShipments } from '@/hooks/useShipment';
import StepOne from './step-one';
import StepTwo from './step-two';
import StepThree from './step-three';
import StepTabs from './step-tabs';

export default function OrderForm() {
  const { Id } = useParams<{ Id: string }>();
  const router = useRouter();
  const isEdit = useMemo(() => Id !== undefined && Id !== 'create', [Id]);
  const [step, setStep] = useState(1);
  const session = useSession();
  const { bahan, getAllBahan } = useGetAllBahan();
  const { jenisData, getAllJenis } = useGetAllJenis();
  const { ukuran, getAllUkuran } = useGetAllUkuran();
  const { shipments, getAllShipments } = useGetAllShipments();

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
    totalAmount: 0,
    dpAmount: 0,
    settlementAmount: 0,
    bahanCode: '',
    jenisCode: '',
    shipmentCode: '',
    proofDp: '',
    createdBy: '',
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

  const validateStep3 = () => {
    const newErrors: Partial<Record<string, string>> = {};
    if (!formData.shipmentCode) newErrors.shipmentCode = 'Shipment is required';
    if (!formData.proofDp) newErrors.proofDp = 'Proof DP is required';
    if (!formData.dpAmount) newErrors.dpAmount = 'DP Amount is required';
    if (formData.dpAmount > formData.totalAmount)
      newErrors.dpAmount = 'DP Amount must be less than Total Amount';
    if (formData.dpAmount < formData.totalAmount / 2)
      newErrors.dpAmount = 'DP Amount must be at least 50% of Total Amount';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (step === 1) {
      if (validateStep1()) {
        setStep(2);
      }
    } else if (step === 2) {
      if (validateStep2()) {
        if (formData.jenisCode && formData.orderDetails.length > 0) {
          const pricePerUnit = jenisData.find(
            (jenis) => jenis.code === formData.jenisCode
          )?.harga;
          const totalQuantity = formData.orderDetails.reduce(
            (acc, item) => acc + item.quantity,
            0
          );
          const totalAmount = pricePerUnit ? totalQuantity * pricePerUnit : 0;

          setFormData((prevData) => ({
            ...prevData,
            totalAmount
          }));
        }
        setStep(3);
      }
    }
  };

  const handlePrevStep = () => {
    if (step === 2) {
      setStep(1);
    } else if (step === 3) {
      setStep(2);
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
    if (!validateStep3()) return;

    const totalAmountParse = parseInt(
      formData.totalAmount.toString().replace(/\D/g, '')
    );
    const dpAmountParse = parseInt(
      formData.dpAmount.toString().replace(/\D/g, '')
    );

    const payload = {
      ...formData,
      totalAmount: Number(totalAmountParse),
      dpAmount: Number(dpAmountParse)
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
    getAllShipments({});
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
        <StepTabs step={step} />
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-5 py-5">
          {step === 1 && (
            <StepOne
              formData={formData}
              handleChange={handleChange}
              handleImageUploaded={handleImageUploaded}
              handleNextStep={handleNextStep}
              errors={errors}
              bahan={bahan}
              jenisData={jenisData}
              setFormData={setFormData}
            />
          )}

          {step === 2 && (
            <StepTwo
              formData={formData}
              setFormData={setFormData}
              errors={errors}
              ukuran={ukuran?.data || []}
              handleNextStep={handleNextStep}
              handlePrevStep={handlePrevStep}
            />
          )}

          {step === 3 && (
            <StepThree
              formData={formData}
              setFormData={setFormData}
              errors={errors}
              shipments={shipments}
              bahan={bahan}
              jenisData={jenisData}
              handlePrevStep={handlePrevStep}
              handleSubmit={handleSubmit}
              isCreating={isCreating}
              isFetching={isFetching}
              isUpdating={isUpdating}
              isEdit={isEdit}
            />
          )}
        </form>
      </CardContent>
    </Card>
  );
}
