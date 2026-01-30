"use client";

import { useRouter } from "next/navigation";
import AuthGuard from "../../../../components/AuthGuard";
import { BudgetSettings } from "../../../../components/budgeting/BudgetSettings";
import { ROUTES } from "@/constants/routes";
import { useTranslations } from "@/hooks";

export default function BudgetingSettingsPage() {
  const router = useRouter();
  const t = useTranslations();

  const handleClose = () => {
    router.push(ROUTES.BUDGETING.HOME);
  };

  return (
    <AuthGuard>
      <div className="min-h-screen p-8">
        <div className="max-w-3xl mx-auto">
          <button
            onClick={() => router.back()}
            className="mb-4 text-gray-600 hover:text-gray-800 active:bg-gray-200 active:text-gray-900 p-2 rounded flex items-center"
          >
            <span className="text-xl mr-2">{"<"}</span> {t("common.back", "Back")}
          </button>
          <h1 className="text-2xl font-bold mb-6">{t("budgeting.settings", "Budget Settings")}</h1>
          <BudgetSettings onClose={handleClose} />
        </div>
      </div>
    </AuthGuard>
  );
}
