import { NextRequest, NextResponse } from 'next/server';
import { User } from '@prisma/client';
import { BaseAPIResponse } from '@/types/common';
import bcrypt from 'bcryptjs';
import prisma from '@/server/db';

// Get user by id
export async function GET(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const user = await prisma.user.findUnique({
            where: {
                id: params.id
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                gender: true,
                phone: true,
                picture: true
            }
        });

        if (!user) {
            return NextResponse.json(
                {
                    message: 'User not found',
                    code: 404
                },
                { status: 404 }
            );
        }

        const response: BaseAPIResponse<
            Omit<User, 'password' | 'createdAt' | 'updatedAt' | 'deletedAt'>
        > = {
            message: 'User found',
            code: 200,
            data: user
        };

        return NextResponse.json(response);
    } catch (error) {
        const response: BaseAPIResponse = {
            message: 'Error fetching user',
            code: 500
        };
        return NextResponse.json(response, { status: 500 });
    }
}

// Update user
export async function PUT(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params;
        const userData = await request.json();

        if (!id) {
            return NextResponse.json(
                {
                    message: 'User ID is required',
                    code: 400
                },
                { status: 400 }
            );
        }

        const hashedPassword = await bcrypt.hash(userData.password, 10);

        const user = await prisma.user.update({
            where: { id: String(id) },
            data: {
                name: userData.name,
                email: userData.email,
                role: userData.role,
                phone: userData.phone,
                gender: userData.gender,
                password: hashedPassword
            }
        });

        if (!user) {
            return NextResponse.json(
                {
                    message: 'User not found',
                    code: 404
                },
                { status: 404 }
            );
        }

        const response: BaseAPIResponse = {
            message: 'User updated successfully',
            code: 200,
            data: user
        };

        return NextResponse.json(response);
    } catch (error) {
        const response: BaseAPIResponse = {
            message: 'Error updating user',
            errors: error,
            code: 500
        };
        return NextResponse.json(response, { status: 500 });
    }
}

// Delete user
export async function DELETE(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const user = await prisma.user.delete({
            where: {
                id: params.id
            }
        });

        if (!user) {
            return NextResponse.json(
                {
                    message: 'User not found',
                    code: 404
                },
                { status: 404 }
            );
        }

        const response: BaseAPIResponse = {
            message: 'User deleted successfully',
            code: 200
        };

        return NextResponse.json(response);
    } catch (error) {
        const response: BaseAPIResponse = {
            message: 'Error deleting user',
            errors: error,
            code: 500
        };
        return NextResponse.json(response, { status: 500 });
    }
}
