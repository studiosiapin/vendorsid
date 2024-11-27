import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatRupiah } from '@/lib/utils';
import { StatisticResponse } from '@/types/response';
import React from 'react';

interface TopResellerProps {
    statistics: StatisticResponse;
}

const TopReseller = ({ statistics }: TopResellerProps) => {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="mb-2 text-xl font-medium">
                    Top 5 Reseller
                </CardTitle>
            </CardHeader>
            <CardContent>
                {statistics?.top5Reseller.map((reseller, index) => (
                    <div
                        key={index}
                        className="mb-2 grid grid-cols-[30px_1.5fr_1fr_1fr] items-center gap-2 rounded-md bg-white p-2 py-2 dark:bg-zinc-900 max-md:grid-cols-2"
                    >
                        <div className="px-2 text-2xl font-bold md:text-center">
                            {index + 1}
                        </div>
                        <div className="">
                            <div className="text-sm font-medium">
                                {reseller.reseller?.name}
                            </div>
                            <div className="text-sm text-gray-500">
                                {reseller.reseller?.email}
                            </div>
                        </div>
                        <div className="">
                            <div className="text-sm text-gray-500">
                                Total Order
                            </div>
                            <div className="text-sm font-medium">
                                {reseller.count} Order
                            </div>
                        </div>
                        <div className="">
                            <div className="text-sm text-gray-500">
                                Amount Order
                            </div>
                            <div className="text-sm font-medium">
                                {formatRupiah(reseller.totalAmount || 0)}
                            </div>
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
};

export default TopReseller;
