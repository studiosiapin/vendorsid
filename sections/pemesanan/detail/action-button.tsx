import CurrencyInput from '@/components/currency-input';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  useCompleteOrder,
  useUpdateOrder,
  useUpdateOrderStatus
} from '@/hooks/useOrder';
import { formatRupiah } from '@/lib/utils';
import { Order, OrderStatus } from '@prisma/client';
import { CircleX } from 'lucide-react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';

interface ActionButtonsProps {
  order: Order & {
    orderDetails: {
      ukuranId: string;
      quantity: number;
      ukuran: {
        id: string;
        name: string;
      };
    }[];
  };
  onUpdated: () => void;
}

const ActionButtons = ({ order, onUpdated }: ActionButtonsProps) => {
  const session = useSession();
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus | null>(
    order.status
  );
  const [linkProgress, setLinkProgress] = useState<string>('');
  const [showModal, setShowModal] = useState<boolean>(false);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isReseller, setIsReseller] = useState<boolean>(false);
  const [isDesainSetting, setIsDesainSetting] = useState<boolean>(false);
  const [isPrinting, setIsPrinting] = useState<boolean>(false);
  const [isPressing, setIsPressing] = useState<boolean>(false);
  const [isSewing, setIsSewing] = useState<boolean>(false);
  const [isPacking, setIsPacking] = useState<boolean>(false);
  const [isSuperAdmin, setIsSuperAdmin] = useState<boolean>(false);
  const [settlementAmount, setSettlementAmount] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const remainingPayment = order.totalAmount - order.dpAmount;

  const { isLoading: isUpdating, updateOrderStatus } = useUpdateOrderStatus();
  const { updateOrder } = useUpdateOrder();
  const { isLoading: isCompleting, completeOrder } = useCompleteOrder();

  const handleUpdateOrderStatus = async (
    status: OrderStatus,
    linkProgress: string | null
  ) => {
    // modal konfirmasi
    const conf = confirm(
      `Apakah anda yakin ingin mengubah status pesanan ke ${status}?`
    );
    if (!conf) return;
    if (order) {
      try {
        await updateOrderStatus(
          order.id,
          status,
          linkProgress,
          session.data?.user.id || null
        );
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error updating order status:', error);
      } finally {
        onUpdated();
      }
    }
  };

  const handleFinishOrder = async () => {
    const settlementAmountParse = parseInt(settlementAmount.replace(/\D/g, ''));
    if (!settlementAmount) {
      setErrorMsg('Mohon isi jumlah pembayaran');
      return;
    }

    if (settlementAmountParse === 0 || isNaN(settlementAmountParse)) {
      setErrorMsg('Nominal pelunasan harus diisi');
      return;
    }
    if (settlementAmountParse < remainingPayment) {
      setErrorMsg('Nominal pelunasan tidak boleh kurang dari sisa pembayaran');
      return;
    }
    if (settlementAmountParse > remainingPayment) {
      setErrorMsg('Nominal pelunasan tidak boleh lebih dari sisa pembayaran');
      return;
    }
    if (!session.data) return;

    // modal konfirmasi
    const conf = confirm(`Apakah anda yakin ingin menyelesaikan pesanan ini?`);
    if (!conf) return;
    if (order) {
      try {
        await completeOrder(
          order.id,
          linkProgress,
          session.data?.user.id,
          settlementAmountParse
        );

        closeModal();
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error updating order status:', error);
      } finally {
        onUpdated();
      }
    }
  };

  const closeModal = () => {
    setSelectedStatus(null);
    setLinkProgress('');
    setShowModal(false);
  };

  useEffect(() => {
    if (session) {
      switch (session.data?.user.role) {
        case 'super_admin':
          setIsSuperAdmin(true);
          setIsAdmin(true);
          break;
        case 'admin':
          setIsAdmin(true);
          break;
        case 'reseller':
          setIsReseller(true);
          break;
        case 'desain_setting':
          setIsDesainSetting(true);
          break;
        case 'printing':
          setIsPrinting(true);
          break;
        case 'pressing':
          setIsPressing(true);
          break;
        case 'sewing':
          setIsSewing(true);
          break;
        case 'packing':
          setIsPacking(true);
          break;
        default:
          break;
      }
    }
  }, [session]);

  return (
    <div className="mt-5 flex justify-end gap-3">
      {/* REQUESTED STEP */}
      {order.status === 'REQUESTED' && (
        <>
          {isAdmin && (
            <>
              <Button
                disabled={isUpdating}
                variant="destructive"
                onClick={() => {
                  handleUpdateOrderStatus('CANCELLED', null);
                }}
              >
                Batalkan
              </Button>
              <Link href={`/order/${order.id}`}>
                <Button disabled={isUpdating} variant="secondary">
                  Edit Pesanan
                </Button>
              </Link>
              <Button
                disabled={isUpdating}
                onClick={() => {
                  handleUpdateOrderStatus('APPROVED', null);
                }}
              >
                Setujui
              </Button>
            </>
          )}
          {isReseller && (
            <>
              <Button
                disabled={isUpdating}
                variant="destructive"
                onClick={() => {
                  handleUpdateOrderStatus('CANCELLED', null);
                }}
              >
                Batalkan
              </Button>
              <Link href={`/order/${order.id}`}>
                <Button disabled={isUpdating} variant="secondary">
                  Edit Pesanan
                </Button>
              </Link>
            </>
          )}
        </>
      )}

      {/* APPROVED STEP */}
      {order.status === 'APPROVED' && isAdmin && (
        <Button
          disabled={isUpdating}
          onClick={() => {
            setSelectedStatus('PROOFING');
            setShowModal(true);
          }}
        >
          Upload Proofing
        </Button>
      )}

      {/* PROOFING STEP */}
      {order.status === 'PROOFING' && (isReseller || isAdmin) && (
        <>
          <Button
            disabled={isUpdating}
            onClick={() => {
              handleUpdateOrderStatus('CANCELLED', null);
            }}
            variant={'destructive'}
          >
            Batalkan
          </Button>
          <Button
            disabled={isUpdating}
            onClick={() => {
              handleUpdateOrderStatus('PROOFING_APPROVED', null);
            }}
          >
            Setujui Proofing
          </Button>
        </>
      )}

      {/* PROOFING_APPROVED STEP */}
      {order.status === 'PROOFING_APPROVED' && (isDesainSetting || isAdmin) && (
        <Button
          disabled={isUpdating}
          onClick={() => {
            setSelectedStatus('DESAIN_SETTING');
            setShowModal(true);
          }}
        >
          Upload Progress
        </Button>
      )}

      {/* DESAIN_SETTING STEP */}
      {order.status === 'DESAIN_SETTING' && (isPrinting || isAdmin) && (
        <Button
          disabled={isUpdating}
          onClick={() => {
            setSelectedStatus('PRINTING');
            setShowModal(true);
          }}
        >
          Upload Progress
        </Button>
      )}

      {/* PRINTING STEP */}
      {order.status === 'PRINTING' && (isPressing || isAdmin) && (
        <Button
          disabled={isUpdating}
          onClick={() => {
            setSelectedStatus('PRESSING');
            setShowModal(true);
          }}
        >
          Upload Progress
        </Button>
      )}

      {/* PRESSING STEP */}
      {order.status === 'PRESSING' && (isSewing || isAdmin) && (
        <Button
          disabled={isUpdating}
          onClick={() => {
            setSelectedStatus('SEWING');
            setShowModal(true);
          }}
        >
          Upload Progress
        </Button>
      )}

      {/* SEWING STEP */}
      {order.status === 'SEWING' && (isPacking || isAdmin) && (
        <Button
          disabled={isUpdating}
          onClick={() => {
            setSelectedStatus('PACKING');
            setShowModal(true);
          }}
        >
          Upload Progress
        </Button>
      )}

      {/* PACKING STEP */}
      {order.status === 'PACKING' && isAdmin && (
        <Button
          disabled={isUpdating}
          onClick={() => {
            setSelectedStatus('WAITING_SETTLEMENT');
            setShowModal(true);
          }}
        >
          Upload Progress
        </Button>
      )}

      {/* WAITING_SETTLEMENT STEP */}
      {order.status === 'WAITING_SETTLEMENT' && isAdmin && (
        <Button
          disabled={isUpdating}
          onClick={() => {
            setSelectedStatus('COMPLETED');
            setShowModal(true);
          }}
        >
          Selesaikan Pesanan
        </Button>
      )}

      {showModal && (
        <>
          <div
            className="fixed left-0 top-0 z-[99] h-screen w-screen bg-black/80"
            onClick={() => closeModal()}
          ></div>
          <div className="fixed left-[50%] top-[50%] z-[100] w-full max-w-screen-sm translate-x-[-50%] translate-y-[-50%] rounded-md bg-white p-5 max-md:w-[90%]">
            <div className="relative text-2xl font-semibold">
              Update Progress Pesanan
              <div className="absolute -right-12 -top-12 aspect-square cursor-pointer rounded-full bg-white p-1 max-md:-right-10">
                <CircleX
                  className="text-red-500"
                  width={20}
                  height={20}
                  onClick={() => closeModal()}
                />
              </div>
            </div>

            <div className="my-5 flex flex-col gap-3">
              <p>Progress Pesanan</p>
              <Select
                value={selectedStatus || order.status}
                onValueChange={(value) => {
                  setSelectedStatus(value as OrderStatus);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih Status" />
                </SelectTrigger>
                <SelectContent className="z-[101]">
                  <SelectItem
                    value="PROOFING"
                    disabled={order.status !== 'APPROVED' && !isSuperAdmin}
                  >
                    PROOFING
                  </SelectItem>
                  <SelectItem
                    value="DESAIN_SETTING"
                    disabled={
                      order.status !== 'PROOFING_APPROVED' && !isSuperAdmin
                    }
                  >
                    DESAIN SETTING
                  </SelectItem>
                  <SelectItem
                    value="PRINTING"
                    disabled={
                      order.status !== 'DESAIN_SETTING' && !isSuperAdmin
                    }
                  >
                    PRINTING
                  </SelectItem>
                  <SelectItem
                    value="PRESSING"
                    disabled={order.status !== 'PRINTING' && !isSuperAdmin}
                  >
                    PRESSING
                  </SelectItem>
                  <SelectItem
                    value="SEWING"
                    disabled={order.status !== 'PRESSING' && !isSuperAdmin}
                  >
                    SEWING
                  </SelectItem>
                  <SelectItem
                    value="PACKING"
                    disabled={order.status !== 'SEWING' && !isSuperAdmin}
                  >
                    PACKING
                  </SelectItem>
                  <SelectItem
                    value="WAITING_SETTLEMENT"
                    disabled={order.status !== 'PACKING' && !isSuperAdmin}
                  >
                    WAITING SETTLEMENT
                  </SelectItem>
                  <SelectItem
                    value="COMPLETED"
                    disabled={
                      order.status !== 'WAITING_SETTLEMENT' && !isSuperAdmin
                    }
                  >
                    COMPLETED
                  </SelectItem>
                </SelectContent>
              </Select>

              {/* Input link progress */}
              <p>Link Progress</p>
              <Input
                type="text"
                value={linkProgress}
                onChange={(e) => setLinkProgress(e.target.value)}
              />

              {order.status === 'WAITING_SETTLEMENT' && (
                <>
                  <div className="grid grid-cols-[1fr_150px] gap-2 text-right">
                    <div>Total Pembayaran :</div>
                    <div>{formatRupiah(order.totalAmount)}</div>
                    <div>DP :</div>
                    <div>{formatRupiah(order.dpAmount)}</div>
                    <div>Sisa Pembayaran :</div>
                    <div className="font-bold">
                      {formatRupiah(remainingPayment)}
                    </div>
                  </div>

                  <p>Nominal Pelunasan</p>
                  <CurrencyInput
                    name="settlementAmount"
                    value={settlementAmount.toString()}
                    onChange={(e) => setSettlementAmount(e.target.value)}
                  />
                  {errorMsg && (
                    <p className="text-sm text-red-500">{errorMsg}</p>
                  )}
                </>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button variant={'secondary'} onClick={() => closeModal()}>
                Cancel
              </Button>

              {order.status !== 'WAITING_SETTLEMENT' ? (
                <Button
                  onClick={() => {
                    handleUpdateOrderStatus(
                      selectedStatus as OrderStatus,
                      linkProgress
                    );
                    closeModal();
                  }}
                >
                  Update
                </Button>
              ) : (
                <Button
                  onClick={() => {
                    handleFinishOrder();
                  }}
                >
                  Selesaikan Pesanan
                </Button>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ActionButtons;
