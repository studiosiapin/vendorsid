import { NextRequest, NextResponse } from 'next/server';
import { Desainer } from '@prisma/client';
import { BaseAPIResponse } from '@/types/common';
import prisma from '@/server/db';

// Create a new Desainer
export async function POST(req: NextRequest) {
  try {
    const { name, phone, portofolio, description, imageUrl } = await req.json();

    const newDesainer = await prisma.desainer.create({
      data: {
        name,
        phone,
        portofolio,
        description,
        imageUrl
      }
    });

    const response: BaseAPIResponse<Desainer> = {
      message: 'Desainer created successfully',
      code: 201,
      data: newDesainer
    };

    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json(
      { error: 'Error creating desainer' },
      { status: 500 }
    );
  }
}

// GET all Desainer with pagination and filtering
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
          { phone: { contains: searchQuery, mode: 'insensitive' } },
          { portofolio: { contains: searchQuery, mode: 'insensitive' } }
        ]
      })
    };

    // Count the total number of Desainer matching the filters
    const totalDesainer = await prisma.desainer.count({
      where: filters
    });

    // Fetch Desainer with pagination
    const desainerList = await prisma.desainer.findMany({
      where: filters,
      select: {
        id: true,
        name: true,
        phone: true,
        portofolio: true,
        description: true,
        imageUrl: true
      },
      skip: (page - 1) * limit,
      take: limit
    });

    // Prepare the response
    const response: BaseAPIResponse<
      Omit<Desainer, 'createdAt' | 'updatedAt' | 'deletedAt'>[]
    > = {
      message: 'Desainer found',
      code: 200,
      data: desainerList,
      pagination: {
        next_page: page < Math.ceil(totalDesainer / limit) ? `${page + 1}` : '',
        last_page: `${Math.ceil(totalDesainer / limit)}`,
        page: page,
        data_in_page: desainerList.length,
        total_page: Math.ceil(totalDesainer / limit),
        total_data: totalDesainer
      }
    };

    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json(
      { error: 'Error fetching desainer' },
      { status: 500 }
    );
  }
}
