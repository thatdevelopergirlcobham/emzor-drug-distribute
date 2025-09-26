import { NextRequest, NextResponse } from 'next/server';
import { OrderModel } from '@/lib/dummydata';

export async function GET() {
  try {
    // Get all orders (no authentication required)
    const orders = await OrderModel.find();

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
    const orderData = await request.json();

    // Create new order (no authentication required)
    const newOrder = await OrderModel.create({
      ...orderData,
      userId: orderData.userId || 'user-001', // Default user if not provided
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
