import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase, getDatabaseModels, verifyToken } from '@/lib/mongodb';

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();
    const { UserModel } = getDatabaseModels();

    // Check authentication and admin role
    const token = request.cookies.get('auth-token')?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      );
    }

    const decoded = verifyToken(token);

    if (!decoded || decoded.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, message: 'Admin access required' },
        { status: 403 }
      );
    }

    const users = await UserModel.find({}).select('-password').lean();

    return NextResponse.json({
      success: true,
      data: users,
    }, { status: 200 });

  } catch (error) {
    console.error('Get users error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
