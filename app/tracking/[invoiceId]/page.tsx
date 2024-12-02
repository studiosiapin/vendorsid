'use client';

import { OrderProgressResponse } from '@/app/api/tracking/[invoiceId]/route';
import BadgeStatus from '@/components/badge-status';
import { Button } from '@/components/ui/button';
import { useOrderTracking } from '@/hooks/useOrder';
import { formatDateTime } from '@/lib/utils';
import { OrderStatus } from '@prisma/client';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

const TrackingPage = () => {
    const { invoiceId } = useParams<{ invoiceId: string }>();
    const { isLoading, getOrderTracking } = useOrderTracking();
    const [progress, setProgress] = useState<OrderProgressResponse | null>(
        null
    );

    useEffect(() => {
        getOrderTracking(invoiceId).then((data) => {
            setProgress(data.data);
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [invoiceId]);

    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <span className="text-[2rem] font-semibold">Loading...</span>
            </div>
        );
    }

    return (
        <div className="flex h-screen flex-col items-center justify-center overflow-y-auto pt-[300px]">
            <span className="text-[2rem] font-semibold">Tracking Pesanan</span>

            <div className="mt-5 flex w-full flex-col gap-4 max-md:p-5 md:w-[50%]">
                <div className="flex items-center justify-between">
                    <span className="">
                        Invoice ID: {progress?.order.invoiceId}
                    </span>
                    <BadgeStatus
                        status={progress?.order.status as OrderStatus}
                    />
                </div>
                <div className="flex items-center justify-between">
                    <span className="">Started at</span>
                    <span className="">
                        {formatDateTime(progress?.order.createdAt || '')}
                    </span>
                </div>

                <div className="flex items-center justify-between">
                    <span className="">Finish at</span>
                    <span className="">
                        {formatDateTime(progress?.order.finishAt || '')}
                    </span>
                </div>

                <div className="flex items-center justify-between">
                    <span className="">Order By</span>
                    <span className="">
                        {progress?.user.name} - {progress?.user.email}
                    </span>
                </div>

                <div className="mb-[50px] mt-5">
                    <div className="ml-3 mt-5 border-l-8 border-zinc-200 dark:border-zinc-800">
                        {progress &&
                            progress.progress.map((item) => (
                                <div
                                    className="relative m-3 ml-[20px] mt-8 cursor-pointer rounded-md border bg-white p-3 shadow-lg hover:bg-zinc-50 dark:bg-zinc-900 dark:hover:bg-zinc-800"
                                    key={item.id}
                                >
                                    <div className="absolute -left-[35px] h-5 w-5 rounded-full border-2 border-white bg-blue-600"></div>
                                    <div className="absolute -top-6 left-0 text-sm text-blue-400">
                                        {formatDateTime(item.createdAt)}
                                    </div>
                                    <div className="flex items-center justify-between gap-3">
                                        <div className="flex items-center gap-3">
                                            <BadgeStatus
                                                status={
                                                    item.status as OrderStatus
                                                }
                                            />
                                            <div className="text-sm">
                                                by
                                                <span className="ml-1 text-sm font-bold">
                                                    {item.user.name}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="">
                                            {item.linkProgress && (
                                                <Link
                                                    href={item.linkProgress}
                                                    target="_blank"
                                                >
                                                    <Button size="sm">
                                                        LIHAT
                                                    </Button>
                                                </Link>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TrackingPage;
