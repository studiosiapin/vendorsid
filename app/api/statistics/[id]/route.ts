import { NextRequest, NextResponse } from 'next/server';
import { BaseAPIResponse } from '@/types/common';
import prisma from '@/server/db';

// POST overview statistics
export async function POST(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { startDate, endDate } = await req.json();

        const user = await prisma.user.findUnique({
            where: {
                id: params.id
            }
        });

        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        const isReseller = user.role === 'reseller';
        const isAdmin = user.role === 'admin' || user.role === 'super_admin';

        if (!isReseller && !isAdmin) {
            return NextResponse.json(
                { error: 'User is not an admin or reseller' },
                { status: 403 }
            );
        }

        const dateFilter =
            startDate && endDate
                ? {
                      createdAt: {
                          gte: new Date(startDate),
                          lte: new Date(endDate)
                      }
                  }
                : {};

        // Total Completed Orders
        const totalCompletedOrders = await prisma.order.count({
            where: {
                createdBy: isReseller ? user.id : undefined,
                status: 'COMPLETED',
                ...dateFilter
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

        // TOP 5 Bahan that were ordered
        const top5BahanRaw = await prisma.order.groupBy({
            by: ['bahanCode'],
            _count: {
                id: true
            },
            where: {
                createdBy: isReseller ? user.id : undefined,
                ...dateFilter
            },
            orderBy: {
                _count: {
                    id: 'desc'
                }
            },
            take: 5
        });

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

        const top5Bahan = top5BahanRaw.map((item) => ({
            count: item._count.id,
            bahan: bahanDetails.find((bahan) => bahan.code === item.bahanCode)
        }));

        // TOP 5 Jenis that were ordered
        const top5JenisRaw = await prisma.order.groupBy({
            by: ['jenisCode'],
            _count: {
                id: true
            },
            where: {
                createdBy: isReseller ? user.id : undefined,
                ...dateFilter
            },
            orderBy: {
                _count: {
                    id: 'desc'
                }
            },
            take: 5
        });

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
                status: 'COMPLETED',
                ...dateFilter
            }
        });

        // TOP 5 Resellers
        const top5ResellerRaw = await prisma.order.groupBy({
            by: ['createdBy'],
            _count: {
                id: true
            },
            _sum: {
                totalAmount: true
            },
            where: {
                status: 'COMPLETED',
                ...dateFilter
            },
            orderBy: {
                _count: {
                    id: 'desc'
                }
            },
            take: 5
        });

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
                },
                ...dateFilter
            }
        });

        // Barchart data
        const orderPerDay = await prisma.order.groupBy({
            by: ['createdAt'],
            _count: {
                id: true
            },
            _sum: {
                totalAmount: true
            },
            where: {
                createdBy: isReseller ? user.id : undefined,
                status: 'COMPLETED',
                ...dateFilter
            },
            orderBy: {
                createdAt: 'asc'
            }
        });

        const barchartData = orderPerDay.map((item) => ({
            date: item.createdAt.toISOString().split('T')[0],
            order: item._count.id,
            amount: item._sum.totalAmount || 0
        }));

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
        // eslint-disable-next-line no-console
        console.error(error);
        return NextResponse.json(
            { error: 'Error fetching overview data' },
            { status: 500 }
        );
    }
}
