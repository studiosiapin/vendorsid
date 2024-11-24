import { NextResponse } from 'next/server';
import { BaseAPIResponse } from '@/types/common';
import bcrypt from 'bcryptjs';
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
