import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase, getDatabaseModels, hashPassword, generateToken } from '@/lib/mongodb';

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    const { UserModel } = getDatabaseModels();

    const { name, email, password, role } = await request.json();

    // Validate input
    if (!name || !email || !password || !role) {
      return NextResponse.json(
        { success: false, message: 'All fields are required' },
        { status: 400 }
      );
    }

    // Validate role
    const validRoles = ['ADMIN', 'SUPERVISOR', 'STUDENT'];
    if (!validRoles.includes(role)) {
      return NextResponse.json(
        { success: false, message: 'Invalid role specified' },
        { status: 400 }
      );
    }

    // Validate password length
    if (password.length < 6) {
      return NextResponse.json(
        { success: false, message: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await UserModel.findOne({ email }).lean();

    if (existingUser) {
      return NextResponse.json(
        { success: false, message: 'User with this email already exists' },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const newUser = await UserModel.create({
      id: `user-${Date.now()}`,
      name,
      email,
      password: hashedPassword,
      role,
    });

    // Generate token
    const token = generateToken(newUser.id, newUser.role);

    // Set HTTP-only cookie
    const response = NextResponse.json({
      success: true,
      message: 'Registration successful',
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    }, { status: 201 });

    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    return response;

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
