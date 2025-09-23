import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase, getDatabaseModels, verifyToken } from '@/lib/mongodb';

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();
    const { AllocationModel } = getDatabaseModels();

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

    // Get allocations based on user role
    let allocations;
    if (decoded.role === 'ADMIN') {
      allocations = await AllocationModel.find({}).lean();
    } else if (decoded.role === 'SUPERVISOR') {
      allocations = await AllocationModel.find({ assignedBy: decoded.userId }).lean();
    } else {
      allocations = await AllocationModel.find({ assignedTo: decoded.userId }).lean();
    }

    return NextResponse.json({
      success: true,
      data: allocations,
    }, { status: 200 });

  } catch (error) {
    console.error('Get allocations error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    const { AllocationModel } = getDatabaseModels();

    // Check authentication and supervisor/admin role
    const token = request.cookies.get('auth-token')?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      );
    }

    const decoded = verifyToken(token);

    if (!decoded || !['ADMIN', 'SUPERVISOR'].includes(decoded.role)) {
      return NextResponse.json(
        { success: false, message: 'Supervisor or Admin access required' },
        { status: 403 }
      );
    }

    const allocationData = await request.json();

    // Create new allocation
    const newAllocation = await AllocationModel.create({
      ...allocationData,
      assignedBy: decoded.userId,
      id: `allocation-${Date.now()}`,
    });

    return NextResponse.json({
      success: true,
      data: newAllocation,
      message: 'Allocation created successfully',
    }, { status: 201 });

  } catch (error) {
    console.error('Create allocation error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
