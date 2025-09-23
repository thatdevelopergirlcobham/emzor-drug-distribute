/* eslint-disable @typescript-eslint/no-explicit-any */

import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase, getDatabaseModels, comparePassword, generateToken } from '@/lib/mongodb';

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    const { UserModel } = getDatabaseModels();

    const { email, password } = await request.json();

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Find user
    const user = await UserModel.findOne({ email }).lean() as any & { password: string; };

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Check password
    const isValidPassword = await comparePassword(password, user.password);

    if (!isValidPassword) {
      return NextResponse.json(
        { success: false, message: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Remove password from user object
    const userWithoutPassword = user;

    // Generate token
    const token = generateToken(user.id, user.role);

    // Set HTTP-only cookie
    const response = NextResponse.json({
      success: true,
      message: 'Login successful',
      user: userWithoutPassword,
    }, { status: 200 });

    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    return response;

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
