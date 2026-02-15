import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import CategoryGoal from '@/models/CategoryGoal';
import { getUserFromToken } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const authUser = getUserFromToken(request);
    if (!authUser) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get all category goals for current user
    const goals = await CategoryGoal.find({ userId: authUser.userId })
      .populate('categoryId', 'name type color')
      .sort({ createdAt: -1 });

    return NextResponse.json({ goals });
  } catch (error) {
    console.error('Error fetching category goals:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
