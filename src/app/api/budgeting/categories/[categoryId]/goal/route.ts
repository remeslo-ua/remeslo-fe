import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import CategoryGoal from '@/models/CategoryGoal';
import Category from '@/models/Category';
import { getUserFromToken } from '@/lib/auth';

interface Props {
  params: {
    categoryId: string;
  };
}

export async function POST(request: NextRequest, { params }: Props) {
  try {
    await dbConnect();

    const authUser = getUserFromToken(request);
    if (!authUser) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { categoryId } = params;
    const { monthlyLimit } = await request.json();

    // Validate input
    if (monthlyLimit === undefined) {
      return NextResponse.json(
        { error: 'Monthly limit is required' },
        { status: 400 }
      );
    }

    if (typeof monthlyLimit !== 'number' || monthlyLimit < 0) {
      return NextResponse.json(
        { error: 'Monthly limit must be a non-negative number' },
        { status: 400 }
      );
    }

    // Verify category ownership
    const category = await Category.findById(categoryId);
    if (!category) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }

    if (
      category.userId?.toString() !== authUser.userId &&
      !category.isDefault
    ) {
      return NextResponse.json(
        { error: 'Unauthorized to set goal for this category' },
        { status: 403 }
      );
    }

    // Find existing goal or create new one
    const existingGoal = await CategoryGoal.findOne({
      userId: authUser.userId,
      categoryId: categoryId,
    });

    let goal;
    if (existingGoal) {
      existingGoal.monthlyLimit = monthlyLimit;
      goal = await existingGoal.save();
    } else {
      goal = await CategoryGoal.create({
        userId: authUser.userId,
        categoryId: categoryId,
        monthlyLimit: monthlyLimit,
      });
    }

    return NextResponse.json(
      { message: 'Goal updated successfully', goal },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error updating category goal:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: Props) {
  try {
    await dbConnect();

    const authUser = getUserFromToken(request);
    if (!authUser) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { categoryId } = params;

    // Find and delete goal
    const goal = await CategoryGoal.findOneAndDelete({
      userId: authUser.userId,
      categoryId: categoryId,
    });

    if (!goal) {
      return NextResponse.json(
        { error: 'Goal not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Goal deleted successfully' });
  } catch (error) {
    console.error('Error deleting category goal:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
