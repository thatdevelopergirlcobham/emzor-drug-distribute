import { NextRequest, NextResponse } from 'next/server';
import { ProductModel, verifyToken } from '@/lib/dummydata';

export async function GET() {
  try {
    // Get all products from dummy data
    const products = await ProductModel.find();
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

export async function POST(request: NextRequest) {
  try {
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

    const productData = await request.json();

    // Validate required fields
    if (!productData.name || !productData.category || !productData.price) {
      return NextResponse.json(
        { success: false, message: 'Name, category, and price are required' },
        { status: 400 }
      );
    }

    // Create new product using dummy data model
    const newProduct = await ProductModel.create({
      name: productData.name,
      category: productData.category,
      price: productData.price,
      description: productData.description || '',
      imageUrl: productData.imageUrl || '/images/default-product.jpg',
      stock: productData.stock || 0,
    });

    return NextResponse.json({
      success: true,
      message: 'Product created successfully',
      data: newProduct,
    }, { status: 201 });

  } catch (error) {
    console.error('Create product error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
