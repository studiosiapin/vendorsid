import { NextRequest, NextResponse } from 'next/server';
import { Shipment } from '@prisma/client';
import { BaseAPIResponse } from '@/types/common';
import prisma from '@/server/db';

// Create a new Shipment
export async function POST(req: NextRequest) {
  try {
    const { code, title, description, logo } = await req.json();

    const newShipment = await prisma.shipment.create({
      data: {
        code,
        title,
        description,
        logo
      }
    });

    const response: BaseAPIResponse<Shipment> = {
      message: 'Bahan created successfully',
      code: 201,
      data: newShipment
    };

    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json(
      { error: 'Error creating shipment' },
      { status: 500 }
    );
  }
}

// Get all Shipment with pagination and filtering
export async function GET(req: NextRequest) {
  try {
    const searchQuery = req.nextUrl.searchParams.get('searchQuery') || '';
    const page = parseInt(req.nextUrl.searchParams.get('page') || '1', 10);
    const limit = parseInt(req.nextUrl.searchParams.get('limit') || '10', 10);

    // Filters object
    const filters: any = {
      ...(searchQuery && {
        OR: [
          { title: { contains: searchQuery, mode: 'insensitive' } },
          { code: { contains: searchQuery, mode: 'insensitive' } }
        ]
      })
    };

    // Count the total number of Shipment matching the filters
    const totalShipment = await prisma.shipment.count({
      where: filters
    });

    // Fetch Shipment with pagination
    const shipmentList = await prisma.shipment.findMany({
      where: filters,
      select: {
        id: true,
        code: true,
        title: true,
        description: true,
        logo: true
      },
      skip: (page - 1) * limit,
      take: limit
    });

    // Prepare the response
    const response: BaseAPIResponse<
      Omit<Shipment, 'createdAt' | 'updatedAt' | 'deletedAt'>[]
    > = {
      message: 'Bahan found',
      code: 200,
      data: shipmentList,
      pagination: {
        next_page: page < Math.ceil(totalShipment / limit) ? `${page + 1}` : '',
        last_page: `${Math.ceil(totalShipment / limit)}`,
        page: page,
        data_in_page: shipmentList.length,
        total_page: Math.ceil(totalShipment / limit),
        total_data: totalShipment
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
