import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient, Desainer } from '@prisma/client';
import { BaseAPIResponse } from '@/types/common';

const prisma = new PrismaClient();

// Get desainer by id
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const desainer = await prisma.desainer.findUnique({
      where: {
        id: params.id
      },
      select: {
        id: true,
        name: true,
        phone: true,
        portofolio: true,
        description: true,
        imageUrl: true
      }
    });

    if (!desainer) {
      return NextResponse.json(
        {
          message: 'Desainer not found',
          code: 404
        },
        { status: 404 }
      );
    }

    const response: BaseAPIResponse<
      Omit<Desainer, 'createdAt' | 'updatedAt' | 'deletedAt'>
    > = {
      message: 'Desainer found',
      code: 200,
      data: desainer
    };

    return NextResponse.json(response);
  } catch (error) {
    const response: BaseAPIResponse = {
      message: 'Error fetching desainer',
      code: 500
    };
    return NextResponse.json(response, { status: 500 });
  }
}

// Update desainer
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const desainerData = await request.json();

    if (!id) {
      return NextResponse.json(
        {
          message: 'Desainer ID is required',
          code: 400
        },
        { status: 400 }
      );
    }

    const desainer = await prisma.desainer.update({
      where: { id: String(id) },
      data: {
        name: desainerData.name,
        phone: desainerData.phone,
        portofolio: desainerData.portofolio,
        description: desainerData.description,
        imageUrl: desainerData.imageUrl
      }
    });

    if (!desainer) {
      return NextResponse.json(
        {
          message: 'Desainer not found',
          code: 404
        },
        { status: 404 }
      );
    }

    const response: BaseAPIResponse = {
      message: 'Desainer updated successfully',
      code: 200,
      data: desainer
    };

    return NextResponse.json(response);
  } catch (error) {
    const response: BaseAPIResponse = {
      message: 'Error updating desainer',
      errors: error,
      code: 500
    };
    return NextResponse.json(response, { status: 500 });
  }
}

// Delete desainer
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const desainer = await prisma.desainer.delete({
      where: {
        id: params.id
      }
    });

    if (!desainer) {
      return NextResponse.json(
        {
          message: 'Desainer not found',
          code: 404
        },
        { status: 404 }
      );
    }

    const response: BaseAPIResponse = {
      message: 'Desainer deleted successfully',
      code: 200
    };

    return NextResponse.json(response);
  } catch (error) {
    const response: BaseAPIResponse = {
      message: 'Error deleting desainer',
      errors: error,
      code: 500
    };
    return NextResponse.json(response, { status: 500 });
  }
}
