import { NextRequest, NextResponse } from 'next/server';
import { BaseAPIResponse } from '@/types/common';
import prisma from '@/server/db';
import { Order, User } from '@prisma/client';

export interface OrderProgressResponse {
    order: Order;
    user: User;
    progress: Progress[];
}

export interface Progress {
    id: string;
    status: string;
    linkProgress: string | null;
    user: {
        id: string;
        name: string;
    };
    createdAt: string;
}

// Get Order Progress by Invoice ID
export async function GET(
    req: NextRequest,
    { params }: { params: { invoiceId: string } }
) {
    try {
        const order = await prisma.order.findFirst({
            where: {
                invoiceId: params.invoiceId
            },
            include: {
                user: true
            }
        });

        if (!order) {
            const response: BaseAPIResponse = {
                message: 'Order not found',
                code: 404
            };
            return NextResponse.json(response, { status: 404 });
        }

        const progress = await prisma.orderProgress.findMany({
            where: {
                orderId: order.id
            },
            select: {
                id: true,
                status: true,
                linkProgress: true,
                user: {
                    select: {
                        id: true,
                        name: true
                    }
                },
                createdAt: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        const formattedProgress = progress.map((item) => ({
            ...item,
            createdAt: item.createdAt.toISOString()
        }));

        const response: BaseAPIResponse<OrderProgressResponse> = {
            message: 'Order Progress',
            code: 200,
            data: {
                order,
                user: order.user,
                progress: formattedProgress
            }
        };

        return NextResponse.json(response);
    } catch (error) {
        const response: BaseAPIResponse = {
            message: 'Error fetching order progress',
            errors: error,
            code: 500
        };
        return NextResponse.json(response, { status: 500 });
    }
}
