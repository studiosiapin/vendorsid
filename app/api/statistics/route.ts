import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { BaseAPIResponse } from '@/types/common';

const prisma = new PrismaClient();

// GET overview statistics
export async function GET(req: NextRequest) {
  try {
    // Fetch total income from all orders
    const totalIncome = await prisma.order.aggregate({
      _sum: {
        totalAmount: true
      }
    });

    // Count total users (employees)
    const totalUsers = await prisma.user.count();

    // Count total resellers
    const totalResellers = await prisma.user.count({
      where: {
        role: 'reseller' // Assuming 'reseller' is the role for resellers
      }
    });

    // Count total orders
    const totalOrders = await prisma.order.count();

    // Calculate average orders per user
    const averageOrdersPerUser = totalUsers > 0 ? totalOrders / totalUsers : 0;

    // Count total materials used
    const totalMaterialsUsed = await prisma.bahan.count();

    // Count total sizes used
    const totalSizesUsed = await prisma.ukuran.count();

    // Fetch income trend for the last 6 months
    const incomeTrend = await prisma.order.groupBy({
      by: ['createdAt'],
      _sum: {
        totalAmount: true
      },
      where: {
        createdAt: {
          gte: new Date(new Date().setMonth(new Date().getMonth() - 6)) // Last 6 months
        }
      },
      orderBy: {
        createdAt: 'asc'
      }
    });

    // Prepare the response
    const response: BaseAPIResponse<{
      totalIncome: number;
      totalUsers: number;
      totalResellers: number;
      totalOrders: number;
      averageOrdersPerUser: number;
      totalMaterialsUsed: number;
      totalSizesUsed: number;
      incomeTrend: Array<{ date: Date; totalAmount: number }>;
    }> = {
      message: 'Overview data retrieved successfully',
      code: 200,
      data: {
        totalIncome: totalIncome._sum.totalAmount || 0, // Default to 0 if null
        totalUsers,
        totalResellers,
        totalOrders,
        averageOrdersPerUser,
        totalMaterialsUsed,
        totalSizesUsed,
        incomeTrend: incomeTrend.map((item) => ({
          date: item.createdAt,
          totalAmount: item._sum.totalAmount || 0
        }))
      }
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error(error); // Log the error for debugging
    return NextResponse.json(
      { error: 'Error fetching overview data' },
      { status: 500 }
    );
  }
}
