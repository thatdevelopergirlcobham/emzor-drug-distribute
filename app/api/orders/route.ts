import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase, getDatabaseModels, verifyToken } from '@/lib/dummydata';

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();
    const { OrderModel } = getDatabaseModels();

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

    // Get orders based on user role
    let orders;
    if (decoded.role === 'ADMIN') {
      orders = await OrderModel.find({});
    } else {
      orders = await OrderModel.find({ userId: decoded.userId });
    }

    return NextResponse.json({
      success: true,
      data: orders,
    }, { status: 200 });

  } catch (error) {
    console.error('Get orders error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    const { OrderModel } = getDatabaseModels();

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

    const orderData = await request.json();

    // Create new order
    const newOrder = await OrderModel.create({
      ...orderData,
      userId: decoded.userId,
      id: `order-${Date.now()}`,
    });

    return NextResponse.json({
      success: true,
      data: newOrder,
      message: 'Order created successfully',
    }, { status: 201 });

  } catch (error) {
    console.error('Create order error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
