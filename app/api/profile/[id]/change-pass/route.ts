import prisma from '@/server/db';
import bcrypt from 'bcryptjs';
import { NextRequest, NextResponse } from 'next/server';

// Update password
export async function PUT(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    const id = params.id;
    const { currentPassword, newPassword } = await req.json();

    if (!id || typeof id !== 'string') {
        return NextResponse.json(
            { error: 'Invalid user ID provided' },
            { status: 400 }
        );
    }

    try {
        const user = await prisma.user.findUnique({ where: { id } });

        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        const isPasswordValid = await bcrypt.compare(
            currentPassword,
            user.password
        );

        if (!isPasswordValid) {
            return NextResponse.json(
                { error: 'Current password is incorrect' },
                { status: 400 }
            );
        }

        const hashedNewPassword = await bcrypt.hash(newPassword, 10);

        await prisma.user.update({
            where: { id },
            data: { password: hashedNewPassword }
        });

        return NextResponse.json({
            message: 'Password updated successfully',
            code: 200
        });
    } catch (error) {
        return NextResponse.json(
            { error: 'Error updating password' },
            { status: 500 }
        );
    }
}
