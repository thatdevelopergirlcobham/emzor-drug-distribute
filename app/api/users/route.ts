import { NextResponse } from 'next/server';
import { UserModel } from '@/lib/dummydata';

export async function GET() {
  try {
    const users = await UserModel.find();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const usersWithoutPasswords = users.map(({ password, ...user }) => user);

    return NextResponse.json({
      success: true,
      data: usersWithoutPasswords,
    }, { status: 200 });

  } catch (error) {
    console.error('Get users error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
