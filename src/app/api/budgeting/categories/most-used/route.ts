import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Expense from '@/models/Expense';
import Income from '@/models/Income';
import Category from '@/models/Category';
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

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type'); // 'expense' or 'income'

    // Aggregate category usage from expenses
    const expenseUsage = type !== 'income' ? await Expense.aggregate([
      { $match: { userId: userId, category: { $exists: true, $ne: null } } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
    ]) : [];

    // Aggregate category usage from income
    const incomeUsage = type !== 'expense' ? await Income.aggregate([
      { $match: { userId: userId, category: { $exists: true, $ne: null } } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
    ]) : [];

    // Combine and get category details
    const combinedUsage = [...expenseUsage, ...incomeUsage];
    const usageMap = new Map();

    combinedUsage.forEach((item) => {
      const categoryId = item._id.toString();
      const existingCount = usageMap.get(categoryId) || 0;
      usageMap.set(categoryId, existingCount + item.count);
    });

    // Fetch category details
    const categoryIds = Array.from(usageMap.keys());
    const categories = await Category.find({
      _id: { $in: categoryIds },
      ...(type ? { type } : {}),
    });

    // Map usage counts to categories
    const categoriesWithUsage = categories.map((cat) => ({
      _id: cat._id,
      name: cat.name,
      type: cat.type,
      color: cat.color,
      icon: cat.icon,
      iconType: cat.iconType,
      isDefault: cat.isDefault,
      usageCount: usageMap.get(cat._id.toString()) || 0,
    }));

    // Separate user-created and default categories with usage
    const userCreatedWithUsage = categoriesWithUsage.filter((cat) => !cat.isDefault);
    const defaultWithUsage = categoriesWithUsage.filter((cat) => cat.isDefault);

    // Sort by usage count descending
    userCreatedWithUsage.sort((a, b) => b.usageCount - a.usageCount);
    defaultWithUsage.sort((a, b) => b.usageCount - a.usageCount);

    // Also get unused categories (default and user's custom)
    const unusedCategories = await Category.find({
      $or: [
        { isDefault: true },
        { userId: userId },
      ],
      _id: { $nin: categoryIds },
      ...(type ? { type } : {}),
    });

    const unusedCategoriesFormatted = unusedCategories.map((cat) => ({
      _id: cat._id,
      name: cat.name,
      type: cat.type,
      color: cat.color,
      icon: cat.icon,
      iconType: cat.iconType,
      isDefault: cat.isDefault,
      usageCount: 0,
    }));

    // Separate user-created and default unused categories
    const userCreatedUnused = unusedCategoriesFormatted.filter((cat) => !cat.isDefault);
    const defaultUnused = unusedCategoriesFormatted.filter((cat) => cat.isDefault);

    // Sort unused alphabetically
    userCreatedUnused.sort((a, b) => a.name.localeCompare(b.name));
    defaultUnused.sort((a, b) => a.name.localeCompare(b.name));

    // Combine: user-created (with usage → unused) then defaults (with usage → unused)
    const allCategories = [
      ...userCreatedWithUsage,
      ...userCreatedUnused,
      ...defaultWithUsage,
      ...defaultUnused,
    ];

    return NextResponse.json(allCategories);
  } catch (error) {
    console.error('Most used categories error:', error);
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
  }
}
