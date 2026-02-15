"use client";
import Link from "next/link";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGear, faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';
import { TransactionsFeed } from "../../../components/budgeting/TransactionsFeed";
import { Dashboard } from "../../../components/budgeting/Dashboard";
import AuthGuard from "../../../components/AuthGuard";
import { ROUTES } from "@/constants/routes";
import { useTranslations } from "@/hooks";

interface Category {
  _id: string;
  name: string;
  type: 'expense' | 'income';
  color: string;
  isDefault: boolean;
}

export default function BudgetingPage() {
  const t = useTranslations();

  return (
    <AuthGuard>
      <div className="min-h-screen p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header with Settings Button */}
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl md:text-4xl font-bold">{t('budgeting.budgeting', 'Budgeting')}</h1>
            <Link
              href={ROUTES.BUDGETING.SETTINGS}
              className="p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label={t('common.settings', 'Settings')}
            >
              <FontAwesomeIcon icon={faGear} className="w-5 h-5 text-black dark:text-white" />
            </Link>
          </div>
          <div className="flex justify-center gap-4 md:gap-6 mb-8">
            <Link href={ROUTES.BUDGETING.ADD_EXPENSE}>
              <button className="w-[38px] h-[38px] md:w-40 md:h-40 rounded-full bg-red-500 hover:bg-red-600 active:bg-red-700 text-white font-bold flex flex-col items-center justify-center text-center transition-colors shadow-lg gap-2">
                <FontAwesomeIcon icon={faMinus} className="w-6 h-6 md:w-8 md:h-8" />
              </button>
            </Link>
            <Link href={ROUTES.BUDGETING.ADD_INCOME}>
              <button className="w-[38px] h-[38px] md:w-40 md:h-40 rounded-full bg-green-500 hover:bg-green-600 active:bg-green-700 text-white font-bold flex flex-col items-center justify-center text-center transition-colors shadow-lg gap-2">
                <FontAwesomeIcon icon={faPlus} className="w-6 h-6 md:w-8 md:h-8" />
              </button>
            </Link>
          </div>

          <Dashboard />

          <div className="mt-8">
            <TransactionsFeed title={t('budgeting.recentTransactions', 'Recent Transactions')} />
          </div>
        </div>

      </div>
    </AuthGuard>
  );
}