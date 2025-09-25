import { NextRequest, NextResponse } from 'next/server';
import { UserModel, generateToken } from '@/lib/dummydata';

export async function POST(request: NextRequest) {
  try {
    const { email: userEmail, password: userPassword } = await request.json();

    // Validate input
    if (!userEmail || !userPassword) {
      return NextResponse.json(
        { success: false, message: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Find user
    const user = await UserModel.findOne({ email: userEmail });

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Check password (simple comparison for mock data)
    const isValidPassword = userPassword === user.password;

    if (!isValidPassword) {
      return NextResponse.json(
        { success: false, message: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Create user object without password
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = user;

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
