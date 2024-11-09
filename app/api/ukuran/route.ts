import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient, Ukuran } from '@prisma/client';
import { BaseAPIResponse } from '@/types/common';

const prisma = new PrismaClient();

// Create a new Ukuran
export async function POST(req: NextRequest) {
  try {
    const { code, name, description } = await req.json();

    const newUkuran = await prisma.ukuran.create({
      data: {
        code,
        name,
        description
      }
    });

    const response: BaseAPIResponse<Ukuran> = {
      message: 'Ukuran created successfully',
      code: 201,
      data: newUkuran
    };

    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json(
      { error: 'Error creating ukuran' },
      { status: 500 }
    );
  }
}

// GET all Ukuran with pagination and filtering
export async function GET(req: NextRequest) {
  try {
    // Extract query parameters
    const searchQuery = req.nextUrl.searchParams.get('searchQuery') || '';
    const page = parseInt(req.nextUrl.searchParams.get('page') || '1', 10);
    const limit = parseInt(req.nextUrl.searchParams.get('limit') || '10', 10);

    // Filters object
    const filters: any = {
      ...(searchQuery && {
        OR: [
          { name: { contains: searchQuery, mode: 'insensitive' } },
          { code: { contains: searchQuery, mode: 'insensitive' } }
        ]
      })
    };

    // Count the total number of Ukuran matching the filters
    const totalUkuran = await prisma.ukuran.count({
      where: filters
    });

    // Fetch Ukuran with pagination
    const ukuranList = await prisma.ukuran.findMany({
      where: filters,
      select: {
        id: true,
        code: true,
        name: true,
        description: true
      },
      skip: (page - 1) * limit,
      take: limit
    });

    // Prepare the response
    const response: BaseAPIResponse<
      Omit<Ukuran, 'createdAt' | 'updatedAt' | 'deletedAt'>[]
    > = {
      message: 'Ukuran found',
      code: 200,
      data: ukuranList,
      pagination: {
        next_page: page < Math.ceil(totalUkuran / limit) ? `${page + 1}` : '',
        last_page: `${Math.ceil(totalUkuran / limit)}`,
        page: page,
        data_in_page: ukuranList.length,
        total_page: Math.ceil(totalUkuran / limit),
        total_data: totalUkuran
      }
    };

    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json(
      { error: 'Error fetching ukuran' },
      { status: 500 }
    );
  }
}
