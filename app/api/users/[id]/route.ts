import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase, getDatabaseModels, verifyToken } from '@/lib/dummydata';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();
    const { UserModel } = getDatabaseModels();

    // Check authentication
    const token = request.cookies.get('auth-token')?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      );
    }

    const decoded = verifyToken(token);

    if (!decoded) {
      return NextResponse.json(
        { success: false, message: 'Invalid token' },
        { status: 401 }
      );
    }

    // Only admin can update users
    if (decoded.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, message: 'Admin access required' },
        { status: 403 }
      );
    }

    const updateData = await request.json();
    const { id } = params;

    // Update user
    const updatedUser = await UserModel.findByIdAndUpdate(id, updateData);

    if (!updatedUser) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    // Remove password from response
    const { password, ...userWithoutPassword } = updatedUser;

    return NextResponse.json({
      success: true,
      message: 'User updated successfully',
      data: userWithoutPassword,
    }, { status: 200 });

  } catch (error) {
    console.error('Update user error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();
    const { UserModel } = getDatabaseModels();

    // Check authentication
    const token = request.cookies.get('auth-token')?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      );
    }

    const decoded = verifyToken(token);

    if (!decoded) {
      return NextResponse.json(
        { success: false, message: 'Invalid token' },
        { status: 401 }
      );
    }

    // Only admin can delete users
    if (decoded.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, message: 'Admin access required' },
        { status: 403 }
      );
    }

    const { id } = params;

    // Prevent deleting admin users
    const userToDelete = await UserModel.findOne({ id });
    if (userToDelete && userToDelete.role === 'ADMIN') {
      return NextResponse.json(
        { success: false, message: 'Cannot delete admin users' },
        { status: 403 }
      );
    }

    // Delete user
    const deletedUser = await UserModel.findOneAndDelete({ id });

    if (!deletedUser) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'User deleted successfully',
    }, { status: 200 });

  } catch (error) {
    console.error('Delete user error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();
    const { UserModel } = getDatabaseModels();

    // Check authentication
    const token = request.cookies.get('auth-token')?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      );
    }

    const decoded = verifyToken(token);

    if (!decoded) {
      return NextResponse.json(
        { success: false, message: 'Invalid token' },
        { status: 401 }
      );
    }

    const { id } = params;

    // Users can only view their own profile, admins can view all
    if (decoded.role !== 'ADMIN' && decoded.userId !== id) {
      return NextResponse.json(
        { success: false, message: 'Access denied' },
        { status: 403 }
      );
    }

    const user = await UserModel.findOne({ id });

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    // Remove password from response
    const { password, ...userWithoutPassword } = user;

    return NextResponse.json({
      success: true,
      data: userWithoutPassword,
    }, { status: 200 });

  } catch (error) {
    console.error('Get user error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
