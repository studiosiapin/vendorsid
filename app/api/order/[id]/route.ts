import { NextRequest, NextResponse } from 'next/server';
import { Order } from '@prisma/client';
import { BaseAPIResponse } from '@/types/common';
import { orderFormDataType } from '@/hooks/useOrder';
import prisma from '@/server/db';

// Get Order by ID
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const order = await prisma.order.findUnique({
      where: {
        id: params.id
      },
      select: {
        id: true,
        title: true,
        invoiceId: true,
        description: true,
        linkMockup: true,
        linkCollar: true,
        linkLayout: true,
        linkSharedrive: true,
        startAt: true,
        finishAt: true,
        totalAmount: true,
        dpAmount: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        bahanCode: true,
        jenisCode: true,
        settlementAmount: true,
        linkTracking: true,
        createdBy: true,
        OrderDetail: {
          select: {
            id: true,
            orderId: true,
            quantity: true,
            ukuranId: true,
            ukuran: {
              select: {
                id: true,
                name: true
              }
            }
          }
        },
        user: {
          select: {
            id: true,
            name: true
          }
        }
        // Add any other fields that you want to return
      }
    });

    if (!order) {
      return NextResponse.json(
        {
          message: 'Order not found',
          code: 404
        },
        { status: 404 }
      );
    }

    const response: BaseAPIResponse<orderFormDataType> = {
      message: 'Order found',
      code: 200,
      data: {
        ...order,
        orderDetails: order.OrderDetail,
        startAt: new Date(order.startAt).toISOString().split('T')[0],
        finishAt: new Date(order.finishAt).toISOString().split('T')[0]
      }
    };

    return NextResponse.json(response);
  } catch (error) {
    const response: BaseAPIResponse = {
      message: `Error fetching order ${error}`,
      code: 500
    };
    return NextResponse.json(response, { status: 500 });
  }
}

// Update Order
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const {
      title,
      description,
      linkMockup,
      linkCollar,
      linkLayout,
      linkSharedrive,
      startAt,
      finishAt,
      totalAmount,
      dpAmount,
      bahanCode,
      jenisCode,
      status,
      orderDetails
    } = await req.json();

    // Cari order berdasarkan id
    const existingOrder = await prisma.order.findUnique({
      where: { id: params.id }
    });

    if (!existingOrder) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    const updatedOrder = await prisma.order.update({
      where: { id: params.id },
      data: {
        title,
        description,
        linkMockup,
        linkCollar,
        linkLayout,
        linkSharedrive,
        startAt,
        finishAt,
        totalAmount,
        dpAmount,
        bahanCode,
        jenisCode,
        status
      }
    });

    if (orderDetails) {
      await prisma.orderDetail.deleteMany({
        where: {
          orderId: updatedOrder.id
        }
      });

      await prisma.orderDetail.createMany({
        data: orderDetails.map((detail: { quantity: any; ukuranId: any }) => ({
          orderId: updatedOrder.id,
          quantity: detail.quantity,
          ukuranId: detail.ukuranId // Misalkan detail memiliki ukuranId
        }))
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

// Delete Order
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.order.delete({
      where: {
        id: params.id
      }
    });

    const response: BaseAPIResponse = {
      message: 'Order deleted successfully',
      code: 200
    };

    return NextResponse.json(response);
  } catch (error) {
    const response: BaseAPIResponse = {
      message: 'Error deleting order',
      errors: error,
      code: 500
    };
    return NextResponse.json(response, { status: 500 });
  }
}
