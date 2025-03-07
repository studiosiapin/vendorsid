import { NextRequest, NextResponse } from 'next/server';
import { Bahan } from '@prisma/client';
import { BaseAPIResponse } from '@/types/common';
import prisma from '@/server/db';

// Create a new Bahan
export async function POST(req: NextRequest) {
    try {
        const { code, name, description, imageUrl } = await req.json();

        const newBahan = await prisma.bahan.create({
            data: {
                code,
                name,
                description,
                imageUrl
            }
        });

        const response: BaseAPIResponse<Bahan> = {
            message: 'Bahan created successfully',
            code: 201,
            data: newBahan
        };

        return NextResponse.json(response);
    } catch (error) {
        return NextResponse.json(
            { error: 'Error creating bahan' },
            { status: 500 }
        );
    }
}

// Get all Bahan with pagination and filtering
export async function GET(req: NextRequest) {
    try {
        const searchQuery = req.nextUrl.searchParams.get('searchQuery') || '';
        const page = parseInt(req.nextUrl.searchParams.get('page') || '1', 10);
        const limit = parseInt(
            req.nextUrl.searchParams.get('limit') || '10',
            10
        );

        // Filters object
        const filters: any = {
            ...(searchQuery && {
                OR: [
                    { name: { contains: searchQuery, mode: 'insensitive' } },
                    { code: { contains: searchQuery, mode: 'insensitive' } }
                ]
            })
        };

        // Count the total number of Bahan matching the filters
        const totalBahan = await prisma.bahan.count({
            where: filters
        });

        // Fetch Bahan with pagination
        const bahanList = await prisma.bahan.findMany({
            where: filters,
            select: {
                id: true,
                code: true,
                name: true,
                description: true,
                imageUrl: true
            },
            skip: (page - 1) * limit,
            take: limit
        });

        // Prepare the response
        const response: BaseAPIResponse<
            Omit<Bahan, 'createdAt' | 'updatedAt' | 'deletedAt'>[]
        > = {
            message: 'Bahan found',
            code: 200,
            data: bahanList,
            pagination: {
                total_data: totalBahan,
                total_page: Math.ceil(totalBahan / limit),
                page
            }
        };

        return NextResponse.json(response);
    } catch (error) {
        return NextResponse.json(
            { error: 'Error fetching bahan' },
            { status: 500 }
        );
    }
}
