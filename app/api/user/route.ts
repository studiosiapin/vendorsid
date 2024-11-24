import { NextRequest, NextResponse } from 'next/server';
import { User } from '@prisma/client';
import { BaseAPIResponse } from '@/types/common';
import bcrypt from 'bcryptjs';
import prisma from '@/server/db';

export async function POST(req: NextRequest) {
  try {
    const { name, email, password, role, gender, phone } = await req.json();

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
        gender,
        phone
      }
    });

    const response: BaseAPIResponse<User> = {
      message: 'User created successfully',
      code: 201,
      data: newUser
    };

    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json({ error: 'Error creating user' }, { status: 500 });
  }
}

// GET all users with pagination and filtering

export async function GET(req: NextRequest) {
  try {
    // Extract query parameters
    const searchQuery = req.nextUrl.searchParams.get('searchQuery') || '';
    const page = parseInt(req.nextUrl.searchParams.get('page') || '1', 10);
    const limit = parseInt(req.nextUrl.searchParams.get('limit') || '10', 10);
    const gender = req.nextUrl.searchParams.get('gender') || undefined;
    const role = req.nextUrl.searchParams.get('role') || undefined;

    // Filters object
    const filters: any = {
      ...(gender && { gender }),
      ...(role && { role }),
      ...(searchQuery && {
        OR: [
          { name: { contains: searchQuery, mode: 'insensitive' } },
          { email: { contains: searchQuery, mode: 'insensitive' } }
        ]
      })
    };

    // Count the total number of users matching the filters
    const totalUsers = await prisma.user.count({
      where: filters
    });

    // Fetch users with pagination
    const users = await prisma.user.findMany({
      where: filters,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        gender: true,
        phone: true,
        picture: true
      },
      skip: (page - 1) * limit,
      take: limit
    });

    // Prepare the response
    const response: BaseAPIResponse<
      Omit<User, 'password' | 'createdAt' | 'updatedAt' | 'deletedAt'>[]
    > = {
      message: 'Users found',
      code: 200,
      data: users,
      pagination: {
        next_page: page < Math.ceil(totalUsers / limit) ? `${page + 1}` : '',
        last_page: `${Math.ceil(totalUsers / limit)}`,
        page: page,
        data_in_page: users.length,
        total_page: Math.ceil(totalUsers / limit),
        total_data: totalUsers
      }
    };

    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json(
      { error: 'Error fetching users' },
      { status: 500 }
    );
  }
}
