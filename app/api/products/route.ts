import { NextResponse } from 'next/server';
import { connectToDatabase, getDatabaseModels } from '@/lib/mongodb';

export async function GET() {
  try {
    await connectToDatabase();
    const { ProductModel } = getDatabaseModels();

    // Get all products
    const products = await ProductModel.find({}).lean();

    return NextResponse.json({
      success: true,
      data: products,
    }, { status: 200 });

  } catch (error) {
    console.error('Get products error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
