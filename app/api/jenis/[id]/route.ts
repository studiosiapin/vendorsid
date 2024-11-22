import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient, Jenis } from '@prisma/client';
import { BaseAPIResponse } from '@/types/common';

const prisma = new PrismaClient();

// Get Jenis by ID
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const jenis = await prisma.jenis.findUnique({
      where: {
        id: params.id
      },
      select: {
        id: true,
        code: true,
        name: true,
        harga: true,
        description: true,
        imageUrl: true
      }
    });

    if (!jenis) {
      return NextResponse.json(
        {
          message: 'Jenis not found',
          code: 404
        },
        { status: 404 }
      );
    }

    const response: BaseAPIResponse<
      Omit<Jenis, 'createdAt' | 'updatedAt' | 'deletedAt'>
    > = {
      message: 'Jenis found',
      code: 200,
      data: jenis
    };

    return NextResponse.json(response);
  } catch (error) {
    const response: BaseAPIResponse = {
      message: 'Error fetching jenis',
      code: 500
    };
    return NextResponse.json(response, { status: 500 });
  }
}

// Update Jenis by ID
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const jenisData = await req.json();

    const updatedJenis = await prisma.jenis.update({
      where: {
        id: params.id
      },
      data: {
        code: jenisData.code,
        name: jenisData.name,
        harga: jenisData.harga,
        description: jenisData.description,
        imageUrl: jenisData.imageUrl
      }
    });

    const response: BaseAPIResponse<Jenis> = {
      message: 'Jenis updated successfully',
      code: 200,
      data: updatedJenis
    };

    return NextResponse.json(response);
  } catch (error) {
    const response: BaseAPIResponse = {
      message: 'Error updating jenis',
      errors: error,
      code: 500
    };
    return NextResponse.json(response, { status: 500 });
  }
}

// Delete Jenis by ID
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const jenis = await prisma.jenis.delete({
      where: {
        id: params.id
      }
    });

    const response: BaseAPIResponse = {
      message: 'Jenis deleted successfully',
      code: 200
    };

    return NextResponse.json(response);
  } catch (error) {
    const response: BaseAPIResponse = {
      message: 'Error deleting jenis',
      errors: error,
      code: 500
    };
    return NextResponse.json(response, { status: 500 });
  }
}
