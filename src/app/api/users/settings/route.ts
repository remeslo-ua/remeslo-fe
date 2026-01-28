import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

async function getUserFromToken(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    return decoded.userId;
  } catch {
    return null;
  }
}

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const userId = await getUserFromToken(request);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await User.findById(userId).select('theme budgetGoal currencySymbol analyticsTimeRange');
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      theme: user.theme || 'light',
      budgetGoal: user.budgetGoal || null,
      currencySymbol: user.currencySymbol || '$',
      analyticsTimeRange: user.analyticsTimeRange || 'month',
    });
  } catch (error) {
    console.error('Settings GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    await connectDB();

    const userId = await getUserFromToken(request);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { theme, budgetGoal, currencySymbol, analyticsTimeRange } = body;

    const updateData: any = {};
    if (theme) updateData.theme = theme;
    if (budgetGoal !== undefined) updateData.budgetGoal = budgetGoal;
    if (currencySymbol !== undefined) updateData.currencySymbol = currencySymbol;
    if (analyticsTimeRange) updateData.analyticsTimeRange = analyticsTimeRange;

    const user = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select('theme budgetGoal currencySymbol analyticsTimeRange');

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      theme: user.theme,
      budgetGoal: user.budgetGoal,
      currencySymbol: user.currencySymbol,
      analyticsTimeRange: user.analyticsTimeRange,
    });
  } catch (error) {
    console.error('Settings PATCH error:', error);
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
  }
}
