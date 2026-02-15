"use client";

import { useMemo, useState, useEffect, useRef } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Button,
} from "@nextui-org/react";
import { PrimaryButton, PrimaryInput } from "@/components/shared";
import { useAuthContext } from "@/providers/AuthProvider";
import { useTranslations } from "@/hooks";
import toast from "react-hot-toast";
import { useForm, Controller, useWatch } from "react-hook-form";

interface Category {
  _id: string;
  name: string;
  type: "expense" | "income";
  color: string;
  isDefault: boolean;
}

interface CategoryGoal {
  _id: string;
  userId: string;
  categoryId: string | { _id: string };
  monthlyLimit: number;
}

interface CategorySpending {
  categoryId: string;
  spent: number;
}

interface FormData {
  goals: Record<string, string>;
}

export const CategoryGoalsManager = () => {
  const { state } = useAuthContext();
  const t = useTranslations();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [goals, setGoals] = useState<Record<string, CategoryGoal>>({});
  const [categorySpending, setCategorySpending] = useState<Record<string, number>>({});
  const [currencySymbol, setCurrencySymbol] = useState<string>("$");
  const [viewMode, setViewMode] = useState<"card" | "table">("card");
  const isMountedRef = useRef(true);

  const { control, handleSubmit, formState: { errors }, setValue } = useForm<FormData>({
    defaultValues: {
      goals: {},
    },
  });

  const watchedGoals = useWatch({ control, name: "goals" });

  const totalCategoryBudgets = useMemo(() => {
    if (!watchedGoals) return 0;
    return Object.values(watchedGoals).reduce((sum, value) => {
      const parsed = parseFloat(value || "0");
      if (Number.isNaN(parsed)) return sum;
      return sum + parsed;
    }, 0);
  }, [watchedGoals]);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (state.token) {
      fetchData();
    }
  }, [state.token]);

  const formatCurrency = (amount: number) => {
    return `${currencySymbol}${amount.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const fetchData = async () => {
    try {
      // Fetch user settings for currency
      const settingsRes = await fetch("/api/users/settings", {
        headers: {
          Authorization: `Bearer ${state.token}`,
        },
      });

      if (settingsRes.ok) {
        const settingsData = await settingsRes.json();
        setCurrencySymbol(settingsData.currencySymbol || "$");
      }

      // Fetch categories
      const categoriesRes = await fetch("/api/budgeting/categories", {
        headers: {
          Authorization: `Bearer ${state.token}`,
        },
      });

      if (!categoriesRes.ok) throw new Error("Failed to fetch categories");
      const categoriesData = await categoriesRes.json();

      // Fetch goals
      const goalsRes = await fetch("/api/budgeting/categories/goals", {
        headers: {
          Authorization: `Bearer ${state.token}`,
        },
      });

      const goalsData = goalsRes.ok ? await goalsRes.json() : { goals: [] };

      // Fetch current month expenses
      const currentDate = new Date();
      const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
      
      const dateParams = new URLSearchParams();
      dateParams.set('startDate', startDate.toISOString());
      dateParams.set('endDate', endDate.toISOString());
      
      const expensesRes = await fetch(`/api/budgeting/expenses?limit=10000&${dateParams.toString()}`, {
        headers: {
          Authorization: `Bearer ${state.token}`,
        },
      });

      const expensesData = expensesRes.ok ? await expensesRes.json() : { expenses: [] };

      if (isMountedRef.current) {
        // Filter only expense categories for now
        const expenseCategories = categoriesData.categories.filter(
          (cat: Category) => cat.type === "expense"
        );
        setCategories(expenseCategories);

        // Create goals map
        const goalsMap: Record<string, CategoryGoal> = {};
        if (goalsData.goals && Array.isArray(goalsData.goals)) {
          goalsData.goals.forEach((goal: CategoryGoal) => {
            const categoryId =
              typeof goal.categoryId === "string"
                ? goal.categoryId
                : (goal.categoryId as unknown as { _id?: string })._id;
            if (categoryId) {
              goalsMap[categoryId] = goal;
            }
          });
        }
        setGoals(goalsMap);

        // Calculate spending per category
        const spendingMap: Record<string, number> = {};
        if (expensesData.expenses && Array.isArray(expensesData.expenses)) {
          expensesData.expenses.forEach((expense: any) => {
            const categoryId = expense.category?._id || expense.categoryId;
            if (categoryId) {
              spendingMap[categoryId] = (spendingMap[categoryId] || 0) + expense.amount;
            }
          });
        }
        setCategorySpending(spendingMap);

        // Set form default values
        const defaultValues: Record<string, string> = {};
        expenseCategories.forEach((cat: Category) => {
          defaultValues[cat._id] = goalsMap[cat._id]?.monthlyLimit?.toString() || "";
        });
        
        // Update form values
        expenseCategories.forEach((cat: Category) => {
          setValue(`goals.${cat._id}`, defaultValues[cat._id]);
        });
      }
    } catch (error) {
      if (!isMountedRef.current) return;
      console.error("Failed to fetch data:", error);
      toast.error(
        t("budgeting.failedToLoadCategories", "Failed to load categories"),
      );
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  };

  const onSubmit = async (data: FormData) => {
    setSaving(true);
    try {
      // Update or create goals for each category
      const updatePromises = categories.map(async (category) => {
        const limitStr = data.goals[category._id];
        const limit = limitStr ? parseFloat(limitStr) : null;

        // If limit is null/empty, delete goal if it exists
        if (limit === null || limit === 0) {
          if (goals[category._id]) {
            return fetch(
              `/api/budgeting/categories/${category._id}/goal`,
              {
                method: "DELETE",
                headers: {
                  Authorization: `Bearer ${state.token}`,
                },
              }
            );
          }
          return Promise.resolve();
        }

        // Otherwise, create or update goal
        return fetch(
          `/api/budgeting/categories/${category._id}/goal`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${state.token}`,
            },
            body: JSON.stringify({ monthlyLimit: limit }),
          }
        );
      });

      const responses = await Promise.all(updatePromises);
      const allSuccess = responses.every(
        (res) => res === undefined || (res instanceof Response && res.ok)
      );

      if (!allSuccess) {
        throw new Error("Some goals failed to save");
      }

      toast.success(
        t(
          "budgeting.goalsUpdatedSuccessfully",
          "Goals updated successfully!",
        ),
      );

      // Refresh data
      await fetchData();
    } catch (error: any) {
      toast.error(
        error.message ||
          t("budgeting.failedToUpdateGoals", "Failed to update goals"),
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <h3 className="text-xl font-semibold">
            {t("budgeting.categoryGoals", "Category Budget Goals")}
          </h3>
        </CardHeader>
        <CardBody>
          <div className="text-center py-8">
            {t("common.loading", "Loading...")}
          </div>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h3 className="text-xl font-semibold">
            {t("budgeting.categoryGoals", "Category Budget Goals")}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {t("budgeting.totalCategoryBudgets", "Total category budgets")}: {formatCurrency(totalCategoryBudgets)}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant={viewMode === "card" ? "solid" : "bordered"}
            onClick={() => setViewMode("card")}
          >
            {t("budgeting.cardView", "Cards")}
          </Button>
          <Button
            size="sm"
            variant={viewMode === "table" ? "solid" : "bordered"}
            onClick={() => setViewMode("table")}
          >
            {t("budgeting.tableView", "Table")}
          </Button>
        </div>
      </CardHeader>
      <CardBody>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {viewMode === "card" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map((category) => {
                const spent = categorySpending[category._id] || 0;
                const goal = goals[category._id];
                const limit = goal?.monthlyLimit || 0;
                const hasGoal = limit > 0;
                const remaining = hasGoal ? Math.max(limit - spent, 0) : 0;
                const progressPercent = hasGoal ? Math.min((spent / limit) * 100, 100) : 0;
                const isOverBudget = hasGoal && spent > limit;

                return (
                  <Card key={category._id} className="border">
                    <CardBody className="space-y-3">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-4 h-4 rounded"
                          style={{ backgroundColor: category.color }}
                        />
                        <h4 className="font-semibold">{category.name}</h4>
                      </div>
                      <Controller
                        name={`goals.${category._id}`}
                        control={control}
                        render={({ field }) => (
                          <input
                            {...field}
                            type="number"
                            min="0"
                            placeholder={t(
                              "budgeting.enterBudgetLimit",
                              "Enter budget limit",
                            )}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                          />
                        )}
                      />
                      {hasGoal && (
                        <div className="space-y-2 pt-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600 dark:text-gray-400">
                              {t("budgeting.spent", "Spent")}:
                            </span>
                            <span className={isOverBudget ? "text-red-600 font-semibold" : ""}>
                              {formatCurrency(spent)}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600 dark:text-gray-400">
                              {t("budgeting.remaining", "Remaining")}:
                            </span>
                            <span className={isOverBudget ? "text-red-600 font-semibold" : "text-blue-600"}>
                              {formatCurrency(remaining)}
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${
                                isOverBudget ? 'bg-red-600' : 'bg-blue-600'
                              }`}
                              style={{ width: `${progressPercent}%` }}
                            ></div>
                          </div>
                          {isOverBudget && (
                            <p className="text-xs text-red-600">
                              {t('budgeting.overBudgetBy', 'Over budget by')} {formatCurrency(spent - limit)}
                            </p>
                          )}
                        </div>
                      )}
                      {spent > 0 && !hasGoal && (
                        <div className="text-sm text-gray-500 dark:text-gray-400 pt-2">
                          {t("budgeting.spent", "Spent")}: {formatCurrency(spent)}
                        </div>
                      )}
                    </CardBody>
                  </Card>
                );
              })}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b dark:border-gray-600">
                  <tr>
                    <th className="text-left py-2 px-4 font-semibold">
                      {t("budgeting.category", "Category")}
                    </th>
                    <th className="text-right py-2 px-4 font-semibold">
                      {t("budgeting.monthlyLimit", "Monthly Limit")}
                    </th>
                    <th className="text-right py-2 px-4 font-semibold">
                      {t("budgeting.spent", "Spent")}
                    </th>
                    <th className="text-right py-2 px-4 font-semibold">
                      {t("budgeting.remaining", "Remaining")}
                    </th>
                    <th className="text-left py-2 px-4 font-semibold">
                      {t("budgeting.progress", "Progress")}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((category) => {
                    const spent = categorySpending[category._id] || 0;
                    const goal = goals[category._id];
                    const limit = goal?.monthlyLimit || 0;
                    const hasGoal = limit > 0;
                    const remaining = hasGoal ? Math.max(limit - spent, 0) : 0;
                    const progressPercent = hasGoal ? Math.min((spent / limit) * 100, 100) : 0;
                    const isOverBudget = hasGoal && spent > limit;

                    return (
                      <tr
                        key={category._id}
                        className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                      >
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <div
                              className="w-3 h-3 rounded"
                              style={{ backgroundColor: category.color }}
                            />
                            {category.name}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <Controller
                            name={`goals.${category._id}`}
                            control={control}
                            render={({ field }) => (
                              <input
                                {...field}
                                type="number"
                                min="0"
                                placeholder="—"
                                className="w-full max-w-xs px-3 py-1 border border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white text-right"
                              />
                            )}
                          />
                        </td>
                        <td className="py-3 px-4 text-right">
                          <span className={isOverBudget ? "text-red-600 font-semibold" : ""}>
                            {formatCurrency(spent)}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          {hasGoal ? (
                            <span className={isOverBudget ? "text-red-600 font-semibold" : "text-blue-600"}>
                              {formatCurrency(remaining)}
                            </span>
                          ) : (
                            <span className="text-gray-400">—</span>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          {hasGoal ? (
                            <div className="flex flex-col gap-1">
                              <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                                <div
                                  className={`h-2 rounded-full ${
                                    isOverBudget ? 'bg-red-600' : 'bg-blue-600'
                                  }`}
                                  style={{ width: `${progressPercent}%` }}
                                ></div>
                              </div>
                              {isOverBudget && (
                                <span className="text-xs text-red-600">
                                  {t('budgeting.overBudgetBy', 'Over budget by')} {formatCurrency(spent - limit)}
                                </span>
                              )}
                            </div>
                          ) : (
                            <span className="text-gray-400 text-xs">
                              {t('budgeting.noGoalSet', 'No goal set')}
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          <div className="flex justify-end gap-4 pt-4">
            <PrimaryButton
              text={t("budgeting.updateGoals", "Update Goals")}
              type="submit"
              isLoading={saving}
              color="bg-blue-500"
              styles="hover:bg-blue-600"
            />
          </div>
        </form>

        <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
          {t(
            "budgeting.categoryGoalsDescription",
            "Set spending limits for each category. Empty fields mean no limit for that category.",
          )}
        </p>
      </CardBody>
    </Card>
  );
};
