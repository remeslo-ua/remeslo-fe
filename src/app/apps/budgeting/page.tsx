"use client";
import Link from "next/link";
import { TransactionsList } from "../../../components/budgeting/TransactionsList";
import { Dashboard } from "../../../components/budgeting/Dashboard";
import AuthGuard from "../../../components/AuthGuard";

interface Category {
  _id: string;
  name: string;
  type: 'expense' | 'income';
  color: string;
  isDefault: boolean;
}

export default function BudgetingPage() {
  return (
    <AuthGuard>
      <div className="min-h-screen p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-8">Budgeting</h1>
          <div className="flex justify-center gap-6 mb-8">
            <Link href="/apps/budgeting/add-expense">
              <button className="w-40 h-40 rounded-full bg-red-500 hover:bg-red-600 active:bg-red-700 text-white font-bold flex flex-col items-center justify-center text-center transition-colors">
                <span>Add</span>
                <span>Expense</span>
              </button>
            </Link>
            <Link href="/apps/budgeting/add-income">
              <button className="w-40 h-40 rounded-full bg-green-500 hover:bg-green-600 active:bg-green-700 text-white font-bold flex flex-col items-center justify-center text-center transition-colors">
                <span>Add</span>
                <span>Income</span>
              </button>
            </Link>
          </div>

          <Dashboard />

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mt-8">
            <TransactionsList type="expense" title="Recent Expenses" />
            <TransactionsList type="income" title="Recent Income" />
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}