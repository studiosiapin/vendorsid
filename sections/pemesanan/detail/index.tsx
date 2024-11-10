'use client';
import {
  useGetOrderById,
  useOrderProgress,
  useUpdateOrderStatus
} from '@/hooks/useOrder';
import { Order, OrderStatus } from '@prisma/client';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription
} from '@/components/ui/card';
import Image from 'next/image';
import { formatDate, formatDateTime } from '@/lib/utils';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { useSession } from 'next-auth/react';
import { OrderProgressResponse } from '@/app/api/order/[id]/tracking/route';
import Link from 'next/link';
import TableSkeleton from '@/components/skeleton/TableSkeleton';

const DetailPageOrder = () => {
  const { Id } = useParams<{ Id: string }>();
  const { isLoading: isFetching, getOrderById } = useGetOrderById();
  const { isLoading: isUpdating, updateOrderStatus } = useUpdateOrderStatus();
  const { isLoading: isFetchingProgress, getOrderProgress } =
    useOrderProgress();
  const session = useSession();
  const [order, setOrder] = useState<
    | (Order & {
        orderDetails: {
          ukuranId: string;
          quantity: number;
          ukuran: {
            id: string;
            name: string;
          };
        }[];
      })
    | null
  >(null);
  const [progress, setProgress] = useState<OrderProgressResponse[] | null>(
    null
  );

  // const isAdmin = useMemo(() => session.data?.user.role === 'admin', [session]);

  const handleUpdateOrderStatus = async (status: OrderStatus) => {
    if (order) {
      try {
        await updateOrderStatus(
          order.id,
          status,
          null,
          session.data?.user.id || null
        );
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error updating order status:', error);
      } finally {
        // Refetch the order details after updating the status
        const res = await getOrderById(order.id);
        setOrder(res);
      }
    }
  };

  useEffect(() => {
    if (Id) {
      (async () => {
        try {
          const resOrder = await getOrderById(Id);
          const resProgress = await getOrderProgress(Id);
          setOrder(resOrder.data);
          setProgress(resProgress.data);
        } catch (error) {
          // eslint-disable-next-line no-console
          console.error('Error fetching order details:', error);
        }
      })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Id]);

  return (
    <div className="p-6">
      <Card className="mx-auto w-full bg-white">
        <CardHeader>
          <CardTitle className="text-left text-2xl font-bold">
            Detail Pemesanan
          </CardTitle>
          <CardDescription className="text-left">
            Silahkan atur data pesanan anda.
          </CardDescription>
        </CardHeader>
        <CardContent className="noscrollbar h-[78vh] overflow-auto">
          {order && session && (
            <div className="grid grid-cols-[300px_1fr] gap-7">
              <div className="">
                <div className="grid grid-cols-1 gap-5">
                  <div className="flex flex-col gap-3">
                    <p>Foto Mockup</p>
                    <Image
                      src={order.linkMockup}
                      alt="mockup"
                      width={1000}
                      height={1000}
                      className="w-full"
                    />
                  </div>
                  <div className="flex flex-col gap-3">
                    <p>Foto Kerah</p>
                    <Image
                      src={order.linkCollar}
                      alt="mockup"
                      width={1000}
                      height={1000}
                      className="w-full"
                    />
                  </div>
                  <div className="flex flex-col gap-3">
                    <p>Foto Kerah</p>
                    <Image
                      src={order.linkLayout}
                      alt="mockup"
                      width={1000}
                      height={1000}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>
              <div className="">
                <div className="grid grid-cols-2 gap-3">
                  <div className="">
                    <p className="text-xs text-zinc-500">Invoice Id</p>
                    <p>{order.invoiceId}</p>
                  </div>
                  <div className="">
                    <p className="text-xs text-zinc-500">Status</p>
                    <p>{order.status}</p>
                  </div>
                  <div className="">
                    <p className="text-xs text-zinc-500">Judul</p>
                    <p>{order.title}</p>
                  </div>
                  <div className="">
                    <p className="text-xs text-zinc-500">Deskripsi</p>
                    <p>{order.description}</p>
                  </div>
                  <div className="">
                    <p className="text-xs text-zinc-500">Bahan</p>
                    <p>{order.bahanCode}</p>
                  </div>
                  <div className="">
                    <p className="text-xs text-zinc-500">Jenis</p>
                    <p>{order.jenisCode}</p>
                  </div>
                  <div className="">
                    <p className="text-xs text-zinc-500">Total</p>
                    <p>{order.totalAmount}</p>
                  </div>
                  <div className="">
                    <p className="text-xs text-zinc-500">DP</p>
                    <p>{order.dpAmount}</p>
                  </div>
                  <div className="">
                    <p className="text-xs text-zinc-500">Settlement</p>
                    <p>{order.settlementAmount}</p>
                  </div>
                  <div className="">
                    <p className="text-xs text-zinc-500">Start</p>
                    <p>{formatDate(order.startAt)}</p>
                  </div>
                  <div className="">
                    <p className="text-xs text-zinc-500">Finish</p>
                    <p>{formatDate(order.finishAt)}</p>
                  </div>
                  <div className="">
                    <p className="text-xs text-zinc-500">Link Sharedrive</p>
                    <p>{order.linkSharedrive}</p>
                  </div>
                  <div className="">
                    <p className="text-xs text-zinc-500">Link Tracking</p>
                    <p>{order.linkTracking}</p>
                  </div>
                  <div className="">
                    <p className="text-xs text-zinc-500">Created By</p>
                    <p>{order.createdBy}</p>
                  </div>
                </div>

                <div className="">
                  <div className="mb-2 font-bold">Detail Pesanan</div>

                  {/* Tabel Order Detail */}
                  {order.orderDetails.length > 0 && (
                    <Table className="rounded border-2">
                      <TableHeader>
                        <TableRow>
                          <TableHead>Ukuran</TableHead>
                          <TableHead>Quantity</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {order.orderDetails.map((orderDetail) => (
                          <TableRow key={orderDetail.ukuranId}>
                            <TableCell>{orderDetail.ukuran.name}</TableCell>
                            <TableCell>{orderDetail.quantity}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </div>

                <div className="mt-5">
                  <div className="mb-2 font-bold">Progress</div>

                  {/* Tabel Progress */}
                  <Table className="rounded border-2">
                    <TableHeader>
                      <TableRow>
                        <TableHead>Status</TableHead>
                        <TableHead>Updated By</TableHead>
                        <TableHead>Time</TableHead>
                        <TableHead>Link Progress</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {progress &&
                        progress?.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell>{item.status}</TableCell>
                            <TableCell>{item.user.name}</TableCell>
                            <TableCell>
                              {formatDateTime(item.createdAt)}
                            </TableCell>
                            <TableCell>
                              {item.linkProgress && (
                                <Link
                                  href={item.linkProgress}
                                  className="text-blue-500 underline"
                                >
                                  LIHAT
                                </Link>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </div>

                <div className="mt-5 flex justify-end gap-3">
                  {order.status === 'REQUESTED' && (
                    <>
                      <Button>Edit Pesanan</Button>
                      {session.data?.user.role === 'admin' && (
                        <>
                          <Button
                            disabled={isUpdating}
                            className="bg-red-500 text-white hover:bg-red-600 disabled:bg-red-200"
                            onClick={() => handleUpdateOrderStatus('CANCELLED')}
                          >
                            CANCEL
                          </Button>
                          <Button
                            disabled={isUpdating}
                            className="bg-green-500 text-white hover:bg-green-600 disabled:bg-green-200"
                            onClick={() => handleUpdateOrderStatus('APPROVED')}
                          >
                            APPROVE
                          </Button>
                        </>
                      )}
                    </>
                  )}

                  {order.status === 'APPROVED' && (
                    <>
                      <Button
                        disabled={isUpdating}
                        className="bg-red-500 text-white hover:bg-red-600 disabled:bg-red-200"
                        onClick={() => handleUpdateOrderStatus('CANCELLED')}
                      >
                        CANCEL
                      </Button>
                      <Button
                        disabled={isUpdating}
                        className="bg-green-500 text-white hover:bg-green-600 disabled:bg-green-200"
                        onClick={() => handleUpdateOrderStatus('PROOFING')}
                      >
                        FINISH
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
          <TableSkeleton
            show={isFetching && session.status === 'authenticated'}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default DetailPageOrder;
