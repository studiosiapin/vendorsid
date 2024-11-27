import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';
import { CircleX } from 'lucide-react';
import { orderFormDataType } from '@/hooks/useOrder';

interface StepTwoProps {
    formData: orderFormDataType;
    setFormData: React.Dispatch<React.SetStateAction<orderFormDataType>>;
    errors: Partial<Record<string, string>>;
    ukuran: { id: string; name: string }[];
    handleNextStep: () => void;
    handlePrevStep: () => void;
}

export default function StepTwo({
    formData,
    setFormData,
    errors,
    ukuran,
    handleNextStep,
    handlePrevStep
}: StepTwoProps) {
    return (
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
                                        const newOrderDetails = [
                                            ...prevData.orderDetails
                                        ];
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
                                        const newOrderDetails = [
                                            ...prevData.orderDetails
                                        ];
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
                                    {ukuran?.map((ukuran) => (
                                        <SelectItem
                                            key={ukuran.id}
                                            value={ukuran.id}
                                        >
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
                                        const newOrderDetails = [
                                            ...prevData.orderDetails
                                        ];
                                        newOrderDetails[index].quantity =
                                            Number(e.target.value);
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
                <Button onClick={handlePrevStep} type="button" className="mt-3">
                    Back
                </Button>
                <Button onClick={handleNextStep} type="button" className="mt-3">
                    Next
                </Button>
            </div>
        </>
    );
}
