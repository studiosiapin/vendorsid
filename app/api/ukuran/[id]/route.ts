import { NextRequest, NextResponse } from 'next/server';
import { Ukuran } from '@prisma/client';
import { BaseAPIResponse } from '@/types/common';
import prisma from '@/server/db';

// Get ukuran by id
export async function GET(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const ukuran = await prisma.ukuran.findUnique({
            where: {
                id: params.id
            },
            select: {
                id: true,
                code: true,
                name: true,
                description: true
            }
        });

        if (!ukuran) {
            return NextResponse.json(
                {
                    message: 'Ukuran not found',
                    code: 404
                },
                { status: 404 }
            );
        }

        const response: BaseAPIResponse<
            Omit<Ukuran, 'createdAt' | 'updatedAt' | 'deletedAt'>
        > = {
            message: 'Ukuran found',
            code: 200,
            data: ukuran
        };

        return NextResponse.json(response);
    } catch (error) {
        const response: BaseAPIResponse = {
            message: 'Error fetching ukuran',
            code: 500
        };
        return NextResponse.json(response, { status: 500 });
    }
}

// Update ukuran
export async function PUT(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params;
        const ukuranData = await request.json();

        if (!id) {
            return NextResponse.json(
                {
                    message: 'Ukuran ID is required',
                    code: 400
                },
                { status: 400 }
            );
        }

        const ukuran = await prisma.ukuran.update({
            where: { id: String(id) },
            data: {
                code: ukuranData.code,
                name: ukuranData.name,
                description: ukuranData.description
            }
        });

        if (!ukuran) {
            return NextResponse.json(
                {
                    message: 'Ukuran not found',
                    code: 404
                },
                { status: 404 }
            );
        }

        const response: BaseAPIResponse = {
            message: 'Ukuran updated successfully',
            code: 200,
            data: ukuran
        };

        return NextResponse.json(response);
    } catch (error) {
        const response: BaseAPIResponse = {
            message: 'Error updating ukuran',
            errors: error,
            code: 500
        };
        return NextResponse.json(response, { status: 500 });
    }
}

// Delete ukuran
export async function DELETE(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const ukuran = await prisma.ukuran.delete({
            where: {
                id: params.id
            }
        });

        if (!ukuran) {
            return NextResponse.json(
                {
                    message: 'Ukuran not found',
                    code: 404
                },
                { status: 404 }
            );
        }

        const response: BaseAPIResponse = {
            message: 'Ukuran deleted successfully',
            code: 200
        };

        return NextResponse.json(response);
    } catch (error) {
        const response: BaseAPIResponse = {
            message: 'Error deleting ukuran',
            errors: error,
            code: 500
        };
        return NextResponse.json(response, { status: 500 });
    }
}
