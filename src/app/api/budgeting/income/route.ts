import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Income from '@/models/Income';
import Category from '@/models/Category';
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

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const category = searchParams.get('category');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    // Build query
    const query: any = { userId: authUser.userId };

    if (category) {
      query.category = category;
    }

    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    // Get income with pagination
    const income = await Income.find(query)
      .populate('category', 'name color')
      .sort({ date: -1 })
      .limit(limit)
      .skip((page - 1) * limit);

    const total = await Income.countDocuments(query);

    return NextResponse.json({
      income,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching income:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const authUser = getUserFromToken(request);
    if (!authUser) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const {
      amount,
      description,
      category,
      date,
      paymentMethod,
      client,
      invoice,
      project,
      status,
      tags,
    } = await request.json();

    // Validate required fields
    if (!amount || !description) {
      return NextResponse.json(
        { error: 'Amount and description are required' },
        { status: 400 }
      );
    }

    // If category not provided, find a default income category
    let incomeCategory = category;
    if (!incomeCategory) {
      const defaultCategory = await Category.findOne({
        $or: [
          { userId: authUser.userId, type: 'income', isDefault: true },
          { isDefault: true, type: 'income' }
        ]
      });
      if (defaultCategory) {
        incomeCategory = defaultCategory._id;
      } else {
        // Find any income category
        const anyIncomeCategory = await Category.findOne({ type: 'income' });
        if (anyIncomeCategory) {
          incomeCategory = anyIncomeCategory._id;
        } else {
          return NextResponse.json(
            { error: 'No income categories found. Please create an income category first.' },
            { status: 400 }
          );
        }
      }
    }

    // Create income
    const income = await Income.create({
      userId: authUser.userId,
      amount: parseFloat(amount),
      description,
      category: incomeCategory,
      date: date ? new Date(date) : new Date(),
      paymentMethod: paymentMethod || 'cash',
      client,
      invoice,
      project,
      status: status || 'received',
      tags: tags || [],
    });

    // Populate category info
    await income.populate('category', 'name color');

    return NextResponse.json(
      { message: 'Income created successfully', income },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating income:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}