import CurrencyInput from '@/components/currency-input';
import SupabaseImageUploader from '@/components/supabase-image-uploader';
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
import Swal from 'sweetalert2';

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
  const [shipmentCost, setShipmentCost] = useState('');
  const [shipmentLink, setShipmentLink] = useState('');
  const [proofSettlement, setProofSettlement] = useState('');
  const [errorMsg, setErrorMsg] = useState<{ [key: string]: string }>({});
  const remainingPayment = order.totalAmount - order.dpAmount;

  const { isLoading: isUpdating, updateOrderStatus } = useUpdateOrderStatus();
  const { updateOrder } = useUpdateOrder();
  const { isLoading: isCompleting, completeOrder } = useCompleteOrder();

  const handleUpdateOrderStatus = async (
    status: OrderStatus,
    linkProgress: string | null,
    shipmentLink?: string | null,
    shipmentCost?: number | null
  ) => {
    Swal.fire({
      title: 'Konfirmasi',
      text: `Apakah anda yakin ingin mengubah status pesanan ke ${status}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Ya',
      cancelButtonText: 'Tidak'
    }).then(async (result) => {
      if (result.isConfirmed) {
        if (order) {
          try {
            await updateOrderStatus(
              order.id,
              status,
              linkProgress,
              session.data?.user.id || null,
              shipmentLink,
              shipmentCost
            );
          } catch (error) {
            // eslint-disable-next-line no-console
            console.error('Error updating order status:', error);
          } finally {
            onUpdated();
          }
        }
      }
    });
  };

  const handleFinishOrder = async () => {
    const settlementAmountParse = parseInt(settlementAmount.replace(/\D/g, ''));
    if (!settlementAmount) {
      setErrorMsg((prev) => ({
        ...prev,
        settlementAmount: 'Mohon isi jumlah pembayaran'
      }));
      return;
    }

    if (settlementAmountParse === 0 || isNaN(settlementAmountParse)) {
      setErrorMsg((prev) => ({
        ...prev,
        settlementAmount: 'Nominal pelunasan harus diisi'
      }));
      return;
    }
    if (settlementAmountParse < remainingPayment) {
      setErrorMsg((prev) => ({
        ...prev,
        settlementAmount:
          'Nominal pelunasan tidak boleh kurang dari sisa pembayaran'
      }));
      return;
    }
    if (settlementAmountParse > remainingPayment) {
      setErrorMsg((prev) => ({
        ...prev,
        settlementAmount:
          'Nominal pelunasan tidak boleh lebih dari sisa pembayaran'
      }));
      return;
    }
    if (!proofSettlement) {
      setErrorMsg((prev) => ({
        ...prev,
        proofSettlement: 'Mohon upload bukti transfer'
      }));
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
          settlementAmountParse,
          proofSettlement
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

  function validateWaitSettlement() {
    if (shipmentCost === '')
      setErrorMsg((prev) => ({
        ...prev,
        shipmentCost: 'Mohon isi biaya pengiriman'
      }));
    if (shipmentLink === '')
      setErrorMsg((prev) => ({
        ...prev,
        shipmentLink: 'Mohon isi link pengiriman'
      }));

    return shipmentCost !== '' && shipmentLink !== '';
  }

  function handleShipmentOrder(): void {
    const isValid = validateWaitSettlement();
    console.debug('isValid', isValid);
    if (isValid) {
      handleUpdateOrderStatus(
        selectedStatus as OrderStatus,
        linkProgress,
        shipmentLink,
        Number(shipmentCost.replace(/\D/g, ''))
      );
      closeModal();
    }
  }

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
        <>
          <Link href={`/order/${order.id}`}>
            <Button disabled={isUpdating} variant="secondary">
              Edit Pesanan
            </Button>
          </Link>
          <Button
            disabled={isUpdating}
            onClick={() => {
              setSelectedStatus('PROOFING');
              setShowModal(true);
            }}
          >
            Upload Proofing
          </Button>
        </>
      )}

      {/* PROOFING STEP */}
      {order.status === 'PROOFING' && (isReseller || isAdmin) && (
        <>
          {isAdmin && (
            <Link href={`/order/${order.id}`}>
              <Button disabled={isUpdating} variant="secondary">
                Edit Pesanan
              </Button>
            </Link>
          )}
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
        <>
          {isAdmin && (
            <Link href={`/order/${order.id}`}>
              <Button disabled={isUpdating} variant="secondary">
                Edit Pesanan
              </Button>
            </Link>
          )}
          <Button
            disabled={isUpdating}
            onClick={() => {
              setSelectedStatus('DESAIN_SETTING');
              setShowModal(true);
            }}
          >
            Upload Progress
          </Button>
        </>
      )}

      {/* DESAIN_SETTING STEP */}
      {order.status === 'DESAIN_SETTING' && (isPrinting || isAdmin) && (
        <>
          {isAdmin && (
            <Link href={`/order/${order.id}`}>
              <Button disabled={isUpdating} variant="secondary">
                Edit Pesanan
              </Button>
            </Link>
          )}
          <Button
            disabled={isUpdating}
            onClick={() => {
              setSelectedStatus('PRINTING');
              setShowModal(true);
            }}
          >
            Upload Progress
          </Button>
        </>
      )}

      {/* PRINTING STEP */}
      {order.status === 'PRINTING' && (isPressing || isAdmin) && (
        <>
          {isAdmin && (
            <Link href={`/order/${order.id}`}>
              <Button disabled={isUpdating} variant="secondary">
                Edit Pesanan
              </Button>
            </Link>
          )}
          <Button
            disabled={isUpdating}
            onClick={() => {
              setSelectedStatus('PRESSING');
              setShowModal(true);
            }}
          >
            Upload Progress
          </Button>
        </>
      )}

      {/* PRESSING STEP */}
      {order.status === 'PRESSING' && (isSewing || isAdmin) && (
        <>
          {isAdmin && (
            <Link href={`/order/${order.id}`}>
              <Button disabled={isUpdating} variant="secondary">
                Edit Pesanan
              </Button>
            </Link>
          )}
          <Button
            disabled={isUpdating}
            onClick={() => {
              setSelectedStatus('SEWING');
              setShowModal(true);
            }}
          >
            Upload Progress
          </Button>
        </>
      )}

      {/* SEWING STEP */}
      {order.status === 'SEWING' && (isPacking || isAdmin) && (
        <>
          {isAdmin && (
            <Link href={`/order/${order.id}`}>
              <Button disabled={isUpdating} variant="secondary">
                Edit Pesanan
              </Button>
            </Link>
          )}
          <Button
            disabled={isUpdating}
            onClick={() => {
              setSelectedStatus('PACKING');
              setShowModal(true);
            }}
          >
            Upload Progress
          </Button>
        </>
      )}

      {/* PACKING STEP */}
      {order.status === 'PACKING' && isAdmin && (
        <>
          {isAdmin && (
            <Link href={`/order/${order.id}`}>
              <Button disabled={isUpdating} variant="secondary">
                Edit Pesanan
              </Button>
            </Link>
          )}
          <Button
            disabled={isUpdating}
            onClick={() => {
              setSelectedStatus('WAITING_SETTLEMENT');
              setShowModal(true);
            }}
          >
            Upload Progress
          </Button>
        </>
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
          <div className="fixed left-[50%] top-[50%] z-[100] max-h-[90vh] w-full max-w-screen-sm translate-x-[-50%] translate-y-[-50%] overflow-y-auto overflow-x-hidden rounded-md bg-white p-5 dark:bg-zinc-900 max-md:w-[90%]">
            <div className="relative text-2xl font-semibold">
              Update Progress Pesanan
              <div className="absolute -right-12 -top-12 aspect-square cursor-pointer rounded-full bg-white p-1 dark:bg-zinc-900 max-md:-right-10">
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

              {order.status === 'PACKING' && (
                <>
                  <p>Link Pengiriman</p>
                  <Input
                    type="text"
                    value={shipmentLink}
                    onChange={(e) => setShipmentLink(e.target.value)}
                  />
                  {errorMsg.shipmentLink && (
                    <p className="text-sm text-red-500">
                      {errorMsg.shipmentLink}
                    </p>
                  )}
                  <p>Biaya Pengiriman</p>
                  <CurrencyInput
                    name="shipmentCost"
                    value={shipmentCost.toString()}
                    onChange={(e) => setShipmentCost(e.target.value)}
                  />
                  {errorMsg.shipmentCost && (
                    <p className="text-sm text-red-500">
                      {errorMsg.shipmentCost}
                    </p>
                  )}
                </>
              )}

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
                  {errorMsg.settlementAmount && (
                    <p className="text-sm text-red-500">
                      {errorMsg.settlementAmount}
                    </p>
                  )}
                  <SupabaseImageUploader
                    name="Bukti Transfer Pelunasan"
                    initialUrl={proofSettlement || ''}
                    onUpload={(url) => setProofSettlement(url)}
                    errMessage={errorMsg.proofSettlement}
                    imageClass="max-h-[400px] w-max mx-auto"
                  />
                </>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button variant={'secondary'} onClick={() => closeModal()}>
                Cancel
              </Button>

              {order.status === 'PACKING' ? (
                <Button onClick={() => handleShipmentOrder()}>
                  Update Pesanan
                </Button>
              ) : order.status !== 'WAITING_SETTLEMENT' ? (
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
