import { NextResponse } from 'next/server';
import { BaseAPIResponse } from '@/types/common';
import prisma from '@/server/db';

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

        const user = await prisma.user.update({
            where: { id },
            data: {
                name: userData.name,
                email: userData.email,
                role: userData.role,
                phone: userData.phone,
                gender: userData.gender,
                picture: userData.picture
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
