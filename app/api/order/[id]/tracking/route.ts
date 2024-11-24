import { NextRequest, NextResponse } from 'next/server';
import { BaseAPIResponse } from '@/types/common';
import prisma from '@/server/db';

export interface OrderProgressResponse {
  id: string;
  status: string;
  linkProgress: string | null;
  user: {
    id: string;
    name: string;
  };
  createdAt: string;
}

// Get Order Progress by ID
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const progress = await prisma.orderProgress.findMany({
      where: {
        orderId: params.id
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
        createdAt: 'asc'
      }
    });

    const formattedProgress = progress.map((item) => ({
      ...item,
      createdAt: item.createdAt.toISOString()
    }));

    const response: BaseAPIResponse<OrderProgressResponse[]> = {
      message: 'Order Progress',
      code: 200,
      data: formattedProgress
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
