"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Card,
  CardBody,
  CardHeader,
} from "@nextui-org/react";
import {
  PrimaryButton,
  PrimaryInput,
  ThemeSwitch,
  LanguageSwitcher,
} from "@/components/shared";
import { CategoryManager } from "./CategoryManager";
import { useForm } from "react-hook-form";
import { useAuthContext } from "@/providers/AuthProvider";
import { useTranslations } from "@/hooks";
import toast from "react-hot-toast";
import { ChevronRightIcon } from "@heroicons/react/24/outline";

interface SettingsFormData {
  currencySymbol: string;
  analyticsTimeRange: "month" | "year" | "all-time";
}

interface BudgetSettingsProps {
  onClose?: () => void;
  onUpdate?: () => void;
}

export const BudgetSettings = ({ onClose, onUpdate }: BudgetSettingsProps) => {
  const { state } = useAuthContext();
  const t = useTranslations();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const isMountedRef = useRef(true);
  const cacheKey = "budgetingSettings";

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    control,
  } = useForm<SettingsFormData>({
    defaultValues: {
      currencySymbol: "$",
      analyticsTimeRange: "month",
    },
  });

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    const cached = typeof window !== "undefined" ? localStorage.getItem(cacheKey) : null;
    if (cached) {
      try {
        const data = JSON.parse(cached);
        setValue("currencySymbol", data.currencySymbol || "$");
        setValue("analyticsTimeRange", data.analyticsTimeRange || "month");
        setLoading(false);
      } catch {
        // ignore cache parse errors
      }
    }

    if (state.token) {
      fetchSettings();
    }
  }, [state.token]);

  const fetchSettings = async () => {
    try {
      const response = await fetch("/api/users/settings", {
        headers: {
          Authorization: `Bearer ${state.token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (isMountedRef.current) {
          setValue("currencySymbol", data.currencySymbol || "$");
          setValue("analyticsTimeRange", data.analyticsTimeRange || "month");
          localStorage.setItem(cacheKey, JSON.stringify({
            currencySymbol: data.currencySymbol || "$",
            analyticsTimeRange: data.analyticsTimeRange || "month",
          }));
        }
      }
    } catch (error) {
      if (!isMountedRef.current) return;
      console.error("Failed to fetch settings:", error);
      toast.error(
        t("budgeting.failedToLoadSettings", "Failed to load settings"),
      );
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  };

  const onSubmit = async (data: SettingsFormData) => {
    setSaving(true);
    try {
      const response = await fetch("/api/users/settings", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${state.token}`,
        },
        body: JSON.stringify({
          currencySymbol: data.currencySymbol,
          analyticsTimeRange: data.analyticsTimeRange,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save settings");
      }

      toast.success(
        t(
          "budgeting.settingsSavedSuccessfully",
          "Settings saved successfully!",
        ),
      );
      localStorage.setItem(cacheKey, JSON.stringify({
        currencySymbol: data.currencySymbol,
        analyticsTimeRange: data.analyticsTimeRange,
      }));
      onUpdate?.();
      onClose?.();
    } catch (error: any) {
      toast.error(
        error.message ||
          t("budgeting.failedToSaveSettings", "Failed to save settings"),
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
            {t("budgeting.settings", "Budget Settings")}
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
    <>
      <Card className="shadow-none border-0">
        <CardBody>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="flex justify-end gap-4">
              <LanguageSwitcher />
              <ThemeSwitch />
            </div>

            {/* Goals Management Link */}
            <Link href="/apps/budgeting/goals">
              <Card className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800 hover:shadow-lg transition cursor-pointer border-0">
                <CardBody className="flex flex-row items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {t("budgeting.budgetingGoals", "Budgeting Goals")}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {t(
                        "budgeting.manageGoalsDescription",
                        "Set overall and category-specific budget goals",
                      )}
                    </p>
                  </div>
                  <ChevronRightIcon className="w-5 h-5 text-blue-500" />
                </CardBody>
              </Card>
            </Link>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <PrimaryInput
                  name="currencySymbol"
                  label={t("budgeting.currencySymbol", "Currency Symbol")}
                  type="text"
                  register={register}
                  validation={{
                    required: t(
                      "budgeting.currencySymbolRequired",
                      "Currency symbol is required",
                    ),
                    maxLength: {
                      value: 5,
                      message: t("validation.maxLength", "Max 5 characters"),
                    },
                  }}
                  errors={errors}
                />
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {t(
                    "budgeting.currencySymbolDescription",
                    "E.g., $, €, ₴ or any custom symbol",
                  )}
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-4">
              {onClose && (
                <PrimaryButton
                  text={t("common.cancel", "Cancel")}
                  type="button"
                  color="bg-gray-500"
                  styles="hover:bg-gray-600"
                  onClick={onClose}
                />
              )}
              <PrimaryButton
                text={t("budgeting.saveSettings", "Save Settings")}
                type="submit"
                isLoading={saving}
                color="bg-blue-500"
                styles="hover:bg-blue-600"
              />
            </div>
          </form>
        </CardBody>
      </Card>

      {/* Categories Management Section */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
          {t("budgeting.categoryManager", "Category Manager")}
        </h2>
        <CategoryManager />
      </div>
    </>
  );
};
