import { NextRequest, NextResponse } from 'next/server';
import { Shipment } from '@prisma/client';
import { BaseAPIResponse } from '@/types/common';
import prisma from '@/server/db';

// Get Shipment by ID
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const shipment = await prisma.shipment.findUnique({
      where: {
        id: params.id
      },
      select: {
        id: true,
        code: true,
        title: true,
        description: true,
        logo: true,
        createdAt: true,
        updatedAt: true
      }
    });

    if (!shipment) {
      return NextResponse.json(
        {
          message: 'Shipment not found',
          code: 404
        },
        { status: 404 }
      );
    }

    const response: BaseAPIResponse<
      Omit<Shipment, 'createdAt' | 'updatedAt' | 'deletedAt'>
    > = {
      message: 'Shipment found',
      code: 200,
      data: shipment
    };

    return NextResponse.json(response);
  } catch (error) {
    const response: BaseAPIResponse = {
      message: 'Error fetching shipment',
      code: 500
    };
    return NextResponse.json(response, { status: 500 });
  }
}

// Update Shipment
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { code, title, description, logo } = await req.json();

    const updatedShipment = await prisma.shipment.update({
      where: { id: params.id },
      data: {
        code,
        title,
        description,
        logo
      }
    });

    const response: BaseAPIResponse<Shipment> = {
      message: 'Shipment updated successfully',
      code: 200,
      data: updatedShipment
    };

    return NextResponse.json(response);
  } catch (error) {
    const response: BaseAPIResponse = {
      message: 'Error updating shipment',
      errors: error,
      code: 500
    };
    return NextResponse.json(response, { status: 500 });
  }
}

// Delete Shipment
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.shipment.delete({
      where: {
        id: params.id
      }
    });

    const response: BaseAPIResponse = {
      message: 'Shipment deleted successfully',
      code: 200
    };

    return NextResponse.json(response);
  } catch (error) {
    const response: BaseAPIResponse = {
      message: 'Error deleting shipment',
      errors: error,
      code: 500
    };
    return NextResponse.json(response, { status: 500 });
  }
}
