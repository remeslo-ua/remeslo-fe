"use client";
import { AddIncomeForm } from "../../../../components/budgeting/AddIncomeForm";
import { useRouter } from "next/navigation";
import AuthGuard from "../../../../components/AuthGuard";
import { ROUTES } from "@/constants/routes";
import { useTranslations } from "@/hooks";

export default function AddIncomePage() {
  const router = useRouter();
  const t = useTranslations();

  const handleSuccess = () => {
    router.push(ROUTES.BUDGETING.HOME);
  };

  const handleCancel = () => {
    router.push(ROUTES.BUDGETING.HOME);
  };

  return (
    <AuthGuard>
      <div className="min-h-screen p-8">
        <div className="max-w-md mx-auto">
          <button
            onClick={() => router.back()}
            className="mb-4 text-gray-600 hover:text-gray-800 active:bg-gray-200 active:text-gray-900 p-2 rounded flex items-center"
          >
            <span className="text-xl mr-2">{'<'}</span> {t('common.back', 'Back')}
          </button>
          <h1 className="text-2xl font-bold mb-6">{t('budgeting.addIncome', 'Add Income')}</h1>
          <AddIncomeForm onSuccess={handleSuccess} onCancel={handleCancel} />
        </div>
      </div>
    </AuthGuard>
  );
}