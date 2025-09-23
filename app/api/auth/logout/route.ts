import { NextResponse } from 'next/server';

export async function POST() {
  try {
    // Clear the auth token cookie
    const response = NextResponse.json({
      success: true,
      message: 'Logout successful',
    }, { status: 200 });

    response.cookies.set('auth-token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 0, // Expire immediately
      path: '/',
    });

    return response;

  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
