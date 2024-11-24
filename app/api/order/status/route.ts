import { NextRequest, NextResponse } from 'next/server';
import { Order } from '@prisma/client';
import { BaseAPIResponse } from '@/types/common';
import prisma from '@/server/db';

// update order status
export async function POST(req: NextRequest) {
  try {
    const { id, status, linkProgress, createdBy } = await req.json();

    const updatedOrder = await prisma.order.update({
      where: { id: id },
      data: { status: status }
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
