import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient, Order, OrderStatus } from '@prisma/client';
import { BaseAPIResponse } from '@/types/common';

const prisma = new PrismaClient();

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
      startAt,
      finishAt,
      totalAmount,
      dpAmount,
      bahanCode,
      jenisCode,
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
        startAt,
        finishAt,
        totalAmount,
        dpAmount,
        settlementAmount: 0,
        status: OrderStatus.REQUESTED,
        bahanCode,
        jenisCode,
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
export async function GET(req: NextRequest) {
  try {
    const orders = await prisma.order.findMany();
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
      { error: 'Error fetching orders' },
      { status: 500 }
    );
  }
}
