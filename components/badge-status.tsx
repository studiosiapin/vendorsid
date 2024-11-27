import { OrderStatus } from '@prisma/client';
import React from 'react';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
    TooltipProvider
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

interface BadgeStatusProps {
    status: OrderStatus;
    size?: 'small' | 'medium' | 'large';
}

const statusColors: Record<OrderStatus, string> = {
    REQUESTED: 'bg-yellow-100 text-yellow-900',
    APPROVED: 'bg-green-100 text-green-900',
    CANCELLED: 'bg-red-500 text-red-900',
    PROOFING: 'bg-blue-100 text-blue-900',
    PROOFING_APPROVED: 'bg-green-100 text-green-900',
    DESAIN_SETTING: 'bg-zinc-100 text-zinc-900',
    PRINTING: 'bg-zinc-100 text-zinc-900',
    PRESSING: 'bg-zinc-100 text-zinc-900',
    SEWING: 'bg-zinc-100 text-zinc-900',
    PACKING: 'bg-zinc-100 text-zinc-900',
    WAITING_SETTLEMENT: 'bg-yellow-500 text-yellow-900',
    COMPLETED: 'bg-green-500 text-green-900'
};

const statusTooltips: Record<OrderStatus, string> = {
    REQUESTED: 'Pesanan sudah diminta',
    APPROVED: 'Pesanan sudah disetujui',
    CANCELLED: 'Pesanan dibatalkan',
    PROOFING:
        'Pesanan telah selesai pada tahap proofing, menunggu persetujuan pemesan.',
    PROOFING_APPROVED: 'Pesanan telah disetujui di tahap proofing',
    DESAIN_SETTING: 'Pesanan telah selesai desain setting',
    PRINTING: 'Pesanan telah selesai dicetak',
    PRESSING: 'Pesanan telah selesai pressing',
    SEWING: 'Pesanan telah selesai dijahit',
    PACKING: 'Pesanan telah selesai dikemas',
    WAITING_SETTLEMENT: 'Pesanan menunggu pembayaran',
    COMPLETED: 'Pesanan sudah selesai'
};

const BadgeStatus = ({ status, size = 'medium' }: BadgeStatusProps) => {
    const sizeClasses = {
        small: 'px-2 py-0.5 text-xs max-md:text-sm max-md:px-2',
        medium: 'px-3 py-1 text-sm max-md:text-sm max-md:px-2 max-md:py-0.5',
        large: 'px-4 py-1.5 text-lg max-md:text-sm max-md:px-2 max-md:py-0.5'
    };

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <div
                        className={cn(
                            'inline-flex cursor-pointer items-center rounded-md font-semibold',
                            statusColors[status],
                            sizeClasses[size]
                        )}
                    >
                        {status}
                    </div>
                </TooltipTrigger>
                <TooltipContent>{statusTooltips[status]}</TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
};

export default BadgeStatus;
