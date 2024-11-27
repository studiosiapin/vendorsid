import { NextRequest, NextResponse } from 'next/server';
import { Order } from '@prisma/client';
import { BaseAPIResponse } from '@/types/common';
import prisma from '@/server/db';

// update order status
export async function POST(req: NextRequest) {
    try {
        const {
            id,
            status,
            linkProgress,
            createdBy,
            shipmentCost,
            shipmentLink
        } = await req.json();

        const totalAmount = await prisma.order.findUnique({
            where: { id },
            select: { totalAmount: true }
        });

        const updatedOrder = await prisma.order.update({
            where: { id: id },
            data: {
                status: status,
                startAt: status === 'PROOFING_APPROVED' ? new Date() : null,
                finishAt:
                    status === 'PROOFING_APPROVED'
                        ? new Date(
                              new Date().getTime() + 7 * 24 * 60 * 60 * 1000
                          )
                        : null,
                shipmentCost: shipmentCost || null,
                shipmentLink: shipmentLink || null,
                totalAmount:
                    totalAmount && totalAmount.totalAmount
                        ? totalAmount.totalAmount + shipmentCost
                        : null
            }
        });

        if (updatedOrder && createdBy) {
            await prisma.orderProgress.create({
                data: {
                    orderId: id,
                    status: status,
                    linkProgress: linkProgress,
                    createdBy: createdBy
                }
            });
        }

        const response: BaseAPIResponse<Order> = {
            message: 'Order updated successfully',
            code: 200,
            data: updatedOrder
        };

        return NextResponse.json(response);
    } catch (error) {
        const response: BaseAPIResponse = {
            message: 'Error updating order',
            errors: error,
            code: 500
        };
        return NextResponse.json(response, { status: 500 });
    }
}
