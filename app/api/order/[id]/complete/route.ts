import prisma from '@/server/db';
import { BaseAPIResponse } from '@/types/common';
import { Order, OrderStatus } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

// Api route for completing an order
export async function POST(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        // Get the order id from the params
        const { id } = params;

        const { linkProgress, userId, settlementAmount, proofSettlement } =
            await req.json();

        // create prisma transaction
        const transaction = await prisma.$transaction([
            // update order settlement amount
            prisma.order.update({
                where: {
                    id
                },
                data: {
                    settlementAmount,
                    status: OrderStatus.COMPLETED,
                    proofSettlement: proofSettlement || null
                }
            }),

            // create order progress
            prisma.orderProgress.create({
                data: {
                    linkProgress,
                    createdBy: userId,
                    orderId: id,
                    status: OrderStatus.COMPLETED
                }
            })
        ]);

        const response: BaseAPIResponse<Order> = {
            message: 'Order completed successfully',
            code: 200,
            data: transaction[0]
        };
        return NextResponse.json(response);
    } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error); // Log the error for debugging
        return NextResponse.json(
            { error: 'Error creating order' },
            { status: 500 }
        );
    }
}
