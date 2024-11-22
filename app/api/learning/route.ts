import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient, Learning } from '@prisma/client';
import { BaseAPIResponse } from '@/types/common';

const prisma = new PrismaClient();

// Create a new Learning
export async function POST(req: NextRequest) {
  try {
    const { thumbnail, name, source, description } = await req.json();

    const newLearning = await prisma.learning.create({
      data: {
        thumbnail,
        name,
        source,
        description
      }
    });

    const response: BaseAPIResponse<Learning> = {
      message: 'Learning created successfully',
      code: 201,
      data: newLearning
    };

    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json(
      { error: 'Error creating learning' },
      { status: 500 }
    );
  }
}

// GET all Learning with pagination and filtering
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
          { source: { contains: searchQuery, mode: 'insensitive' } }
        ]
      })
    };

    // Count the total number of Learning matching the filters
    const totalLearning = await prisma.learning.count({
      where: filters
    });

    // Fetch Learning with pagination
    const learningList = await prisma.learning.findMany({
      where: filters,
      select: {
        id: true,
        thumbnail: true,
        name: true,
        source: true,
        description: true
      },
      skip: (page - 1) * limit,
      take: limit
    });

    // Prepare the response
    const response: BaseAPIResponse<
      Omit<Learning, 'createdAt' | 'updatedAt' | 'deletedAt'>[]
    > = {
      message: 'Learning found',
      code: 200,
      data: learningList,
      pagination: {
        next_page: page < Math.ceil(totalLearning / limit) ? `${page + 1}` : '',
        last_page: `${Math.ceil(totalLearning / limit)}`,
        page: page,
        data_in_page: learningList.length,
        total_page: Math.ceil(totalLearning / limit),
        total_data: totalLearning
      }
    };

    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json(
      { error: 'Error fetching learning' },
      { status: 500 }
    );
  }
}
