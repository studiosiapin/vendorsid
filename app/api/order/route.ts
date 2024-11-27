import { NextRequest, NextResponse } from 'next/server';
import { Order, OrderStatus } from '@prisma/client';
import { BaseAPIResponse } from '@/types/common';
import prisma from '@/server/db';

// Create a new Order
export async function POST(req: NextRequest) {
  try {
    const {
      title,
      description,
      linkMockup,
      linkCollar,
      linkLayout,
      linkSharedrive,
      totalAmount,
      dpAmount,
      startAt,
      finishAt,
      proofDp,
      bahanCode,
      jenisCode,
      shipmentCode,
      createdBy,
      orderDetails // Expecting an array of order detail objects
    } = await req.json();

    const ordersToday = await prisma.order.count({
      where: {
        createdAt: {
          gte: new Date(new Date().setHours(0, 0, 0, 0))
        }
      }
    });

    const invoiceId = `${jenisCode}${new Date()
      .getFullYear()
      .toString()
      .slice(-2)}${new Date().getMonth() + 1}${new Date().getDate()}${
      ordersToday + 1
    }${bahanCode}`;

    const newOrder = await prisma.order.create({
      data: {
        invoiceId,
        title,
        description,
        linkMockup,
        linkCollar,
        linkLayout,
        linkSharedrive,
        totalAmount,
        dpAmount,
        proofDp,
        startAt,
        finishAt,
        settlementAmount: 0,
        status: OrderStatus.REQUESTED,
        bahanCode,
        jenisCode,
        shipmentCode,

        createdBy,
        OrderDetail: {
          createMany: {
            data: orderDetails
          }
        }
      }
    });

    if (newOrder) {
      // insert row order_progress
      await prisma.orderProgress.create({
        data: {
          orderId: newOrder.id,
          status: OrderStatus.REQUESTED,
          createdBy
        }
      });
    }

    const response: BaseAPIResponse<Order> = {
      message: 'Order created successfully',
      code: 201,
      data: newOrder
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

// Get all Orders
export async function GET(req: NextRequest, res: NextResponse) {
  try {
    // Mendapatkan query parameters dari request
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    const limit = parseInt(searchParams.get('limit') || '10', 10); // default limit to 10 if not provided

    const user = await prisma.user.findUnique({
      where: {
        id: userId || undefined
      }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const orders = await prisma.order.findMany({
      where: {
        createdBy:
          user && user.role === 'reseller' ? userId || undefined : undefined,
        ...(user && user.role === 'desain_setting'
          ? { status: 'PROOFING_APPROVED' }
          : {}),
        ...(user?.role === 'printing' ? { status: 'DESAIN_SETTING' } : {}),
        ...(user?.role === 'pressing' ? { status: 'PRINTING' } : {}),
        ...(user?.role === 'sewing' ? { status: 'PRESSING' } : {}),
        ...(user?.role === 'packing' ? { status: 'SEWING' } : {})
      },
      take: limit, // Menggunakan limit yang ditentukan
      include: {
        user: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    const response: BaseAPIResponse<Order[]> = {
      message: 'Orders fetched successfully',
      code: 200,
      data: orders
    };

    return NextResponse.json(response);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error); // Log the error for debugging
    return NextResponse.json(
      { error: 'Error fetching orders', detail: error },
      { status: 500 }
    );
  }
}
