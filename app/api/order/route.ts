import { NextRequest, NextResponse } from 'next/server';
import { Order, OrderStatus } from '@prisma/client';
import { BaseAPIResponse } from '@/types/common';
import prisma from '@/server/db';
import { Prisma } from '@prisma/client';

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

// Get All Transactions
export async function GET(req: NextRequest, res: NextResponse) {
    try {
        // Mendapatkan query parameters dari request
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get('userId');
        const page = parseInt(searchParams.get('page') || '1', 10);
        const pageSize = parseInt(searchParams.get('pageSize') || '10', 10);
        const filters = JSON.parse(searchParams.get('filters') || '{}');
        const searchTerm = searchParams.get('search') || '';
        const skip = (page - 1) * pageSize;

        // Validasi pengguna
        const user = await prisma.user.findUnique({
            where: {
                id: userId || undefined
            }
        });

        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        // Membuat kondisi where
        const where: Prisma.OrderWhereInput = {
            createdBy:
                user && user.role === 'reseller'
                    ? userId || undefined
                    : undefined,
            ...(user && user.role === 'desain_setting'
                ? { status: 'PROOFING_APPROVED' }
                : {}),
            ...(user?.role === 'printing' ? { status: 'DESAIN_SETTING' } : {}),
            ...(user?.role === 'pressing' ? { status: 'PRINTING' } : {}),
            ...(user?.role === 'sewing' ? { status: 'PRESSING' } : {}),
            ...(user?.role === 'packing' ? { status: 'SEWING' } : {}),
            ...(filters && { ...filters }),
            ...(searchTerm && {
                OR: [
                    {
                        invoiceId: {
                            contains: searchTerm,
                            mode: 'insensitive' as Prisma.QueryMode
                        }
                    },
                    {
                        title: {
                            contains: searchTerm,
                            mode: 'insensitive' as Prisma.QueryMode
                        }
                    },
                    {
                        user: {
                            OR: [
                                {
                                    email: {
                                        contains: searchTerm,
                                        mode: 'insensitive' as Prisma.QueryMode
                                    }
                                },
                                {
                                    name: {
                                        contains: searchTerm,
                                        mode: 'insensitive' as Prisma.QueryMode
                                    }
                                },
                                {
                                    AND: searchTerm.split(' ').map((term) => ({
                                        name: {
                                            contains: term,
                                            mode: 'insensitive' as Prisma.QueryMode
                                        }
                                    }))
                                }
                            ]
                        }
                    }
                ]
            })
        };

        // Mendapatkan transaksi
        const transactions = await prisma.order.findMany({
            where,
            skip,
            take: pageSize,
            orderBy: { createdAt: 'desc' },
            include: {
                user: true
            }
        });

        // Menghitung total data
        const totalTransactions = await prisma.order.count({ where });

        // Membuat response
        const response: BaseAPIResponse<typeof transactions> = {
            message: 'Transactions fetched successfully',
            code: 200,
            data: transactions,
            pagination: {
                page,
                total_data: totalTransactions,
                total_page: Math.ceil(totalTransactions / pageSize)
            }
        };

        return NextResponse.json(response);
    } catch (error) {
        // Log error untuk debugging
        // eslint-disable-next-line no-console
        console.error('Error fetching transactions:', error);
        return NextResponse.json(
            { error: 'Error fetching transactions', detail: error },
            { status: 500 }
        );
    }
}
