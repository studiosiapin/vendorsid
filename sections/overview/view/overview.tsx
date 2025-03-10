'use client';
import { BarGraph } from '../bar-graph';
import { CalendarDateRangePicker } from '@/components/date-range-picker';
import PageContainer from '@/components/layout/page-container';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useSession } from 'next-auth/react';
import { formatRupiah, isWorker } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStatistics } from '@/hooks/useStatistics';
import SkeletonOverview from './skeleton-overview';
import { StatisticResponse } from '@/types/response';
import CardStatistics from '@/components/card-statistics';
import TopReseller from './top-reseller';
import { PieBahan } from './pie-bahan';
import { PieJenis } from './pie-jenis';
import { DateRange } from 'react-day-picker';
import { Calendar, XIcon } from 'lucide-react';

export default function OverViewPage() {
    const session = useSession();
    const router = useRouter();
    const { isLoading, getStatistics } = useStatistics();
    const [statistics, setStatistics] = useState<StatisticResponse>();
    const [filterDate, setFilterDate] = useState<DateRange | undefined>();
    const isAdmin =
        session.data?.user?.role === 'admin' ||
        session.data?.user?.role === 'super_admin';

    const activateFilter = () => {
        setFilterDate({
            from: new Date(),
            to: new Date()
        });
    };

    const deactivateFilter = () => {
        setFilterDate(undefined);
    };

    useEffect(() => {
        if (!session.data?.user) return;
        if (isWorker(session.data.user.role)) {
            router.push('/dashboard/pemesanan');
        }
        const result = getStatistics(session.data.user.id);

        if (result) {
            result.then((data) => {
                setStatistics(data.data);
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (!filterDate) return;
        const result = getStatistics(
            session.data?.user?.id as string,
            filterDate.from ? filterDate.from.toISOString() : undefined,
            filterDate.to ? filterDate.to.toISOString() : undefined
        );

        if (result) {
            result.then((data) => {
                setStatistics(data.data);
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filterDate]);

    return (
        <PageContainer scrollable>
            <div className="space-y-2">
                <div className="flex items-center justify-between space-y-2 max-md:items-start max-sm:w-full">
                    <h2 className="text-2xl font-bold tracking-tight max-sm:hidden">
                        Hi, Welcome back 👋
                    </h2>
                    {!filterDate && (
                        <h2 className="text-2xl font-bold tracking-tight sm:hidden">
                            Hi, Welcome back 👋
                        </h2>
                    )}
                    <div className="flex items-center space-x-2">
                        {filterDate ? (
                            <>
                                <CalendarDateRangePicker
                                    initialDate={filterDate}
                                    onChange={(date) => {
                                        setFilterDate(date);
                                    }}
                                />
                                <Button onClick={deactivateFilter} size="icon">
                                    <XIcon className="h-5 w-5" />
                                </Button>
                            </>
                        ) : (
                            <Button onClick={activateFilter} size="icon">
                                <Calendar className="h-5 w-5" />
                            </Button>
                        )}
                        {/* <PrintStatistics /> */}
                    </div>
                </div>
                <Tabs defaultValue="overview" className="space-y-4">
                    <TabsList>
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        {/* <TabsTrigger value="analytics" disabled>
              Analytics
            </TabsTrigger> */}
                    </TabsList>
                    <TabsContent value="overview">
                        {isLoading && <SkeletonOverview />}
                        {statistics && (
                            <div id="stat-continer" className="space-y-4">
                                <div
                                    className={`grid gap-4 ${
                                        isAdmin
                                            ? 'md:grid-cols-2'
                                            : 'md:grid-cols-3'
                                    }`}
                                >
                                    <CardStatistics
                                        title="Total Pemasukan"
                                        icon={
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                className="h-4 w-4 text-muted-foreground"
                                            >
                                                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                                            </svg>
                                        }
                                        value={formatRupiah(
                                            statistics?.totalPemasukan || 0
                                        )}
                                        desc="Total Pesanan yang telah selesai"
                                    />

                                    <CardStatistics
                                        title="Total Pesanan Ongoing"
                                        icon={
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                className="h-4 w-4 text-muted-foreground"
                                            >
                                                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                                            </svg>
                                        }
                                        value={formatRupiah(
                                            statistics?.totalSisa || 0
                                        )}
                                        desc="Total Pesanan yang belum selesai"
                                    />
                                    {!isAdmin && (
                                        <CardStatistics
                                            title="Total Pesanan Selesai"
                                            icon={
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    className="h-4 w-4 text-muted-foreground"
                                                >
                                                    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                                                </svg>
                                            }
                                            value={
                                                statistics?.totalCompletedOrders
                                            }
                                        />
                                    )}
                                </div>
                                {isAdmin && (
                                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                        <CardStatistics
                                            title="Total Pegawai"
                                            icon={
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    className="h-4 w-4 text-muted-foreground"
                                                >
                                                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                                                    <circle
                                                        cx="9"
                                                        cy="7"
                                                        r="4"
                                                    />
                                                    <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                                                </svg>
                                            }
                                            value={statistics?.totalWorkers}
                                        />
                                        <CardStatistics
                                            title="Total Reseller"
                                            icon={
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    className="h-4 w-4 text-muted-foreground"
                                                >
                                                    <rect
                                                        width="20"
                                                        height="14"
                                                        x="2"
                                                        y="5"
                                                        rx="2"
                                                    />
                                                    <path d="M2 10h20" />
                                                </svg>
                                            }
                                            value={statistics?.totalResellers}
                                        />
                                        <CardStatistics
                                            title="Total Pesanan Selesai"
                                            icon={
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    className="h-4 w-4 text-muted-foreground"
                                                >
                                                    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                                                </svg>
                                            }
                                            value={
                                                statistics?.totalCompletedOrders
                                            }
                                        />
                                    </div>
                                )}

                                {isAdmin && (
                                    <TopReseller statistics={statistics} />
                                )}
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    <PieBahan statistics={statistics} />
                                    <PieJenis statistics={statistics} />
                                </div>

                                {isAdmin && (
                                    <BarGraph statistics={statistics} />
                                )}
                            </div>
                        )}
                    </TabsContent>
                </Tabs>
            </div>
        </PageContainer>
    );
}
