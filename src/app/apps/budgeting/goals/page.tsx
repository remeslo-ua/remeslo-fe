"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { GoalSettings } from "@/components/budgeting/GoalSettings";
import { CategoryGoalsManager } from "@/components/budgeting/CategoryGoalsManager";
import { useTranslations } from "@/hooks";

export default function GoalsPage() {
  const t = useTranslations();
  const [refreshKey, setRefreshKey] = useState(0);

  const handleUpdate = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header with back button */}
        <div className="mb-8 flex items-center gap-4">
          <Link
            href="/apps/budgeting/settings"
            className="flex items-center gap-2 text-blue-500 hover:text-blue-600"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            {t("common.back", "Back")}
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {t("budgeting.budgetingGoals", "Budgeting Goals")}
          </h1>
        </div>

        {/* Overall Goal Section */}
        <div className="mb-12">
          <GoalSettings key={`overall-${refreshKey}`} onUpdate={handleUpdate} />
        </div>

        {/* Category Goals Section */}
        <div>
          <CategoryGoalsManager key={`categories-${refreshKey}`} />
        </div>
      </div>
    </div>
  );
}
