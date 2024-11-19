import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { BaseAPIResponse } from '@/types/common';

const prisma = new PrismaClient();

// GET overview statistics
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: params.id
      }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const isReseller = user.role === 'reseller';
    const isAdmin = user.role === 'admin' || user.role === 'super_admin';

    if (!isReseller && !isAdmin) {
      return NextResponse.json(
        { error: 'User is not an admin or reseller' },
        { status: 403 }
      );
    }

    // Total Completed Orders
    const totalCompletedOrders = await prisma.order.count({
      where: {
        createdBy: isReseller ? user.id : undefined,
        status: 'COMPLETED'
      }
    });

    // Total Workers
    const totalWorkers = await prisma.user.count({
      where: {
        role: {
          not: 'reseller'
        }
      }
    });

    // Total Resellers
    const totalResellers = await prisma.user.count({
      where: {
        role: 'reseller'
      }
    });

    // TOP 5 Bahan yang di order (include relasi ke Bahan)
    const top5BahanRaw = await prisma.order.groupBy({
      by: ['bahanCode'],
      _count: {
        id: true
      },
      where: {
        createdBy: isReseller ? user.id : undefined
      },
      orderBy: {
        _count: {
          id: 'desc'
        }
      },
      take: 5
    });

    // Ambil data Bahan berdasarkan bahanCode dari hasil groupBy
    const bahanCodes = top5BahanRaw.map((item) => item.bahanCode);
    const bahanDetails = await prisma.bahan.findMany({
      where: {
        code: { in: bahanCodes }
      },
      select: {
        code: true,
        name: true,
        description: true,
        imageUrl: true
      }
    });

    // Gabungkan hasil groupBy dengan data relasi
    const top5Bahan = top5BahanRaw.map((item) => ({
      count: item._count.id,
      bahan: bahanDetails.find((bahan) => bahan.code === item.bahanCode)
    }));

    // TOP 5 Jenis yang di order (include relasi ke Jenis)
    const top5JenisRaw = await prisma.order.groupBy({
      by: ['jenisCode'],
      _count: {
        id: true
      },
      where: {
        createdBy: isReseller ? user.id : undefined
      },
      orderBy: {
        _count: {
          id: 'desc'
        }
      },
      take: 5
    });

    // Ambil data Jenis berdasarkan jenisCode dari hasil groupBy
    const jenisCodes = top5JenisRaw.map((item) => item.jenisCode);
    const jenisDetails = await prisma.jenis.findMany({
      where: {
        code: { in: jenisCodes }
      },
      select: {
        code: true,
        name: true,
        description: true,
        imageUrl: true
      }
    });

    // Gabungkan hasil groupBy dengan data relasi
    const top5Jenis = top5JenisRaw.map((item) => ({
      count: item._count.id,
      jenis: jenisDetails.find((jenis) => jenis.code === item.jenisCode)
    }));

    // Total Pemasukan Order yg sudah complete
    const totalPemasukan = await prisma.order.aggregate({
      _sum: {
        totalAmount: true
      },
      where: {
        user: {
          id: isReseller ? user.id : undefined
        },
        status: 'COMPLETED'
      }
    });

    // TOP 5 Reseller (ambil dari total order dan total pemasukan)
    const top5ResellerRaw = await prisma.order.groupBy({
      by: ['createdBy'],
      _count: {
        id: true // Total orders
      },
      _sum: {
        totalAmount: true // Total pemasukan
      },
      where: {
        status: 'COMPLETED' // Hanya order yang selesai
      },
      orderBy: {
        _count: {
          id: 'desc' // Urutkan berdasarkan jumlah order
        }
      },
      take: 5 // Ambil 5 teratas
    });

    // Ambil detail User berdasarkan createdBy dari hasil groupBy
    const resellerIds = top5ResellerRaw.map((item) => item.createdBy);
    const resellerDetails = await prisma.user.findMany({
      where: {
        id: { in: resellerIds }
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true
      }
    });

    // Gabungkan hasil groupBy dengan data User
    const top5Reseller = top5ResellerRaw.map((item) => ({
      count: item._count.id,
      totalAmount: item._sum.totalAmount,
      reseller: resellerDetails.find((user) => user.id === item.createdBy)
    }));

    // Total Sisa yang belum lunas
    const totalSisa = await prisma.order.aggregate({
      _sum: {
        totalAmount: true
      },
      where: {
        user: {
          id: isReseller ? user.id : undefined
        },
        status: {
          not: 'COMPLETED'
        }
      }
    });

    // Barchart total order dan amount per hari
    const orderPerDay = await prisma.order.groupBy({
      by: ['createdAt'],
      _count: {
        id: true // Hitung jumlah order
      },
      _sum: {
        totalAmount: true // Jumlahkan total amount
      },
      where: {
        createdBy: isReseller ? user.id : undefined, // Filter jika reseller
        status: 'COMPLETED' // Hanya order yang selesai
      },
      orderBy: {
        createdAt: 'asc' // Urutkan berdasarkan tanggal
      }
    });

    // Format hasilnya agar hanya mengambil tanggal tanpa jam
    const barchartData = orderPerDay.map((item) => ({
      date: item.createdAt.toISOString().split('T')[0], // Ambil tanggal saja
      order: item._count.id, // Jumlah order
      amount: item._sum.totalAmount || 0 // Total amount
    }));

    // Prepare the response
    const response: BaseAPIResponse<{
      role: string;
      totalCompletedOrders: number;
      totalWorkers?: number;
      totalResellers?: number;
      top5Bahan: any[];
      top5Jenis: any[];
      top5Reseller: any[];
      totalPemasukan: any;
      totalSisa: any;
      barchartData?: any[];
    }> = {
      message: 'Overview data retrieved successfully',
      code: 200,
      data: {
        role: user.role,
        totalCompletedOrders,
        totalWorkers: isAdmin ? totalWorkers : undefined,
        totalResellers: isAdmin ? totalResellers : undefined,
        top5Bahan,
        top5Jenis,
        top5Reseller: isAdmin ? top5Reseller : [],
        totalPemasukan: totalPemasukan._sum.totalAmount,
        totalSisa: totalSisa._sum.totalAmount,
        barchartData: isAdmin ? barchartData : undefined
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
