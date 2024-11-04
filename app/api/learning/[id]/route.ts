import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient, Learning } from '@prisma/client';
import { BaseAPIResponse } from '@/types/common';

const prisma = new PrismaClient();

// Get Learning by ID
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const learning = await prisma.learning.findUnique({
      where: {
        id: params.id
      },
      select: {
        id: true,
        name: true,
        source: true,
        description: true
      }
    });

    if (!learning) {
      return NextResponse.json(
        {
          message: 'Learning not found',
          code: 404
        },
        { status: 404 }
      );
    }

    const response: BaseAPIResponse<
      Omit<Learning, 'createdAt' | 'updatedAt' | 'deletedAt'>
    > = {
      message: 'Learning found',
      code: 200,
      data: learning
    };

    return NextResponse.json(response);
  } catch (error) {
    const response: BaseAPIResponse = {
      message: 'Error fetching learning',
      code: 500
    };
    return NextResponse.json(response, { status: 500 });
  }
}

// Update Learning by ID
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const learningData = await req.json();

    const updatedLearning = await prisma.learning.update({
      where: {
        id: params.id
      },
      data: {
        name: learningData.name,
        source: learningData.source,
        description: learningData.description
      }
    });

    const response: BaseAPIResponse<Learning> = {
      message: 'Learning updated successfully',
      code: 200,
      data: updatedLearning
    };

    return NextResponse.json(response);
  } catch (error) {
    const response: BaseAPIResponse = {
      message: 'Error updating learning',
      errors: error,
      code: 500
    };
    return NextResponse.json(response, { status: 500 });
  }
}

// Delete Learning by ID
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const learning = await prisma.learning.delete({
      where: {
        id: params.id
      }
    });

    const response: BaseAPIResponse = {
      message: 'Learning deleted successfully',
      code: 200
    };

    return NextResponse.json(response);
  } catch (error) {
    const response: BaseAPIResponse = {
      message: 'Error deleting learning',
      errors: error,
      code: 500
    };
    return NextResponse.json(response, { status: 500 });
  }
}
