import dbConnect from './mongodb';
import Category from '../models/Category';

const defaultExpenseCategories = [
  { name: 'Materials & Supplies', color: '#EF4444', icon: 'box' },
  { name: 'Labor & Wages', color: '#F59E0B', icon: 'users' },
  { name: 'Equipment Rental', color: '#10B981', icon: 'wrench' },
  { name: 'Permits & Licenses', color: '#3B82F6', icon: 'file-contract' },
  { name: 'Insurance', color: '#8B5CF6', icon: 'shield-halved' },
  { name: 'Utilities', color: '#EC4899', icon: 'bolt' },
  { name: 'Transportation', color: '#6B7280', icon: 'car' },
  { name: 'Tools & Equipment', color: '#059669', icon: 'screwdriver-wrench' },
  { name: 'Marketing & Advertising', color: '#DC2626', icon: 'bullhorn' },
  { name: 'Office Supplies', color: '#7C3AED', icon: 'pen' },
  { name: 'Professional Services', color: '#0891B2', icon: 'briefcase' },
  { name: 'Taxes', color: '#EA580C', icon: 'file-invoice-dollar' },
];

const defaultIncomeCategories = [
  { name: 'Project Payments', color: '#10B981', icon: 'money-bill-wave' },
  { name: 'Contract Work', color: '#3B82F6', icon: 'file-signature' },
  { name: 'Material Sales', color: '#F59E0B', icon: 'boxes-stacked' },
  { name: 'Equipment Rental Income', color: '#8B5CF6', icon: 'hand-holding-dollar' },
  { name: 'Consulting Fees', color: '#EC4899', icon: 'comments-dollar' },
];

export async function seedDefaultCategories() {
  try {
    await dbConnect();

    // Check if default categories already exist
    const existingExpenseCategories = await Category.countDocuments({
      type: 'expense',
      isDefault: true
    });

    const existingIncomeCategories = await Category.countDocuments({
      type: 'income',
      isDefault: true
    });

    if (existingExpenseCategories === 0) {
      const expenseCategories = defaultExpenseCategories.map(cat => ({
        ...cat,
        type: 'expense' as const,
        isDefault: true,
      }));

      await Category.insertMany(expenseCategories);
      console.log('Default expense categories seeded');
    }

    if (existingIncomeCategories === 0) {
      const incomeCategories = defaultIncomeCategories.map(cat => ({
        ...cat,
        type: 'income' as const,
        isDefault: true,
      }));

      await Category.insertMany(incomeCategories);
      console.log('Default income categories seeded');
    }

  } catch (error) {
    console.error('Error seeding categories:', error);
  }
}