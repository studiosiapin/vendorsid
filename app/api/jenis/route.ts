import { NextRequest, NextResponse } from 'next/server';
import { Jenis } from '@prisma/client';
import { BaseAPIResponse } from '@/types/common';
import prisma from '@/server/db';

// Create a new Jenis
export async function POST(req: NextRequest) {
    try {
        const { code, name, harga, description, imageUrl } = await req.json();

        const newJenis = await prisma.jenis.create({
            data: {
                code,
                name,
                harga,
                description,
                imageUrl
            }
        });

        const response: BaseAPIResponse<Jenis> = {
            message: 'Jenis created successfully',
            code: 201,
            data: newJenis
        };

        return NextResponse.json(response);
    } catch (error) {
        return NextResponse.json(
            { error: 'Error creating jenis' },
            { status: 500 }
        );
    }
}

// GET all Jenis with pagination and filtering
export async function GET(req: NextRequest) {
    try {
        // Extract query parameters
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

        // Count the total number of Jenis matching the filters
        const totalJenis = await prisma.jenis.count({
            where: filters
        });

        // Fetch Jenis with pagination
        const jenisList = await prisma.jenis.findMany({
            where: filters,
            select: {
                id: true,
                code: true,
                name: true,
                harga: true,
                description: true,
                imageUrl: true
            },
            skip: (page - 1) * limit,
            take: limit
        });

        // Prepare the response
        const response: BaseAPIResponse<
            Omit<Jenis, 'createdAt' | 'updatedAt' | 'deletedAt'>[]
        > = {
            message: 'Jenis found',
            code: 200,
            data: jenisList,
            pagination: {
                next_page:
                    page < Math.ceil(totalJenis / limit) ? `${page + 1}` : '',
                last_page: `${Math.ceil(totalJenis / limit)}`,
                page: page,
                data_in_page: jenisList.length,
                total_page: Math.ceil(totalJenis / limit),
                total_data: totalJenis
            }
        };

        return NextResponse.json(response);
    } catch (error) {
        return NextResponse.json(
            { error: 'Error fetching jenis' },
            { status: 500 }
        );
    }
}
