import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Category from '@/models/Category';
import { getUserFromToken } from '@/lib/auth';
// import { seedDefaultCategories } from '@/lib/seedCategories';

export async function GET(request: NextRequest) {
  try {
    console.log('Categories API called');
    await dbConnect();
    console.log('Database connected');

    const authUser = getUserFromToken(request);
    if (!authUser) {
      console.log('No auth user found');
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    console.log('Auth user:', authUser.userId);

    // Get both default categories and user's custom categories
    const categories = await Category.find({
      $or: [
        { userId: authUser.userId }, // User's custom categories
        { isDefault: true } // Default categories
      ]
    }).sort({ type: 1, isDefault: 1, name: 1 });

    console.log('Found categories:', categories.length);

    return NextResponse.json({ categories });
  } catch (error) {
    console.error('Error fetching categories:', error);
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

    const { name, type, color } = await request.json();

    // Validate input
    if (!name || !type) {
      return NextResponse.json(
        { error: 'Name and type are required' },
        { status: 400 }
      );
    }

    if (!['expense', 'income'].includes(type)) {
      return NextResponse.json(
        { error: 'Type must be expense or income' },
        { status: 400 }
      );
    }

    // Create category
    const category = await Category.create({
      name,
      type,
      color: color || '#3B82F6',
      userId: authUser.userId,
      isDefault: false,
    });

    return NextResponse.json(
      { message: 'Category created successfully', category },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating category:', error);

    if (error.code === 11000) {
      return NextResponse.json(
        { error: 'Category with this name already exists' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
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
    const categoryId = searchParams.get('id');

    if (!categoryId) {
      return NextResponse.json(
        { error: 'Category ID is required' },
        { status: 400 }
      );
    }

    // Find and check ownership
    const category = await Category.findById(categoryId);
    if (!category) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }

    // Only allow deleting user-created categories
    if (category.isDefault || category.userId?.toString() !== authUser.userId) {
      return NextResponse.json(
        { error: 'Cannot delete this category' },
        { status: 403 }
      );
    }

    await Category.findByIdAndDelete(categoryId);

    return NextResponse.json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Error deleting category:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}