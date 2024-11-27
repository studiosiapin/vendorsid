import { NextRequest, NextResponse } from 'next/server';
import { Bahan } from '@prisma/client';
import { BaseAPIResponse } from '@/types/common';
import prisma from '@/server/db';

// Get Bahan by ID
export async function GET(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const bahan = await prisma.bahan.findUnique({
            where: {
                id: params.id
            },
            select: {
                id: true,
                code: true,
                name: true,
                description: true,
                imageUrl: true,
                createdAt: true,
                updatedAt: true
            }
        });

        if (!bahan) {
            return NextResponse.json(
                {
                    message: 'Bahan not found',
                    code: 404
                },
                { status: 404 }
            );
        }

        const response: BaseAPIResponse<
            Omit<Bahan, 'createdAt' | 'updatedAt' | 'deletedAt'>
        > = {
            message: 'Bahan found',
            code: 200,
            data: bahan
        };

        return NextResponse.json(response);
    } catch (error) {
        const response: BaseAPIResponse = {
            message: 'Error fetching bahan',
            code: 500
        };
        return NextResponse.json(response, { status: 500 });
    }
}

// Update Bahan
export async function PUT(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { code, name, description, imageUrl } = await req.json();

        const updatedBahan = await prisma.bahan.update({
            where: { id: params.id },
            data: {
                code,
                name,
                description,
                imageUrl
            }
        });

        const response: BaseAPIResponse<Bahan> = {
            message: 'Bahan updated successfully',
            code: 200,
            data: updatedBahan
        };

        return NextResponse.json(response);
    } catch (error) {
        const response: BaseAPIResponse = {
            message: 'Error updating bahan',
            errors: error,
            code: 500
        };
        return NextResponse.json(response, { status: 500 });
    }
}

// Delete Bahan
export async function DELETE(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        await prisma.bahan.delete({
            where: {
                id: params.id
            }
        });

        const response: BaseAPIResponse = {
            message: 'Bahan deleted successfully',
            code: 200
        };

        return NextResponse.json(response);
    } catch (error) {
        const response: BaseAPIResponse = {
            message: 'Error deleting bahan',
            errors: error,
            code: 500
        };
        return NextResponse.json(response, { status: 500 });
    }
}
