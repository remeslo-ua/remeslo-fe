"use client";

import { useState, useEffect, useRef } from "react";
import {
  Card,
  CardBody,
  CardHeader,
} from "@nextui-org/react";
import {
  PrimaryButton,
  PrimaryInput,
} from "@/components/shared";
import { useForm } from "react-hook-form";
import { useAuthContext } from "@/providers/AuthProvider";
import { useTranslations } from "@/hooks";
import toast from "react-hot-toast";

interface GoalSettingsData {
  budgetGoal: string;
}

interface GoalSettingsProps {
  onUpdate?: () => void;
}

export const GoalSettings = ({ onUpdate }: GoalSettingsProps) => {
  const { state } = useAuthContext();
  const t = useTranslations();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const isMountedRef = useRef(true);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<GoalSettingsData>({
    defaultValues: {
      budgetGoal: "",
    },
  });

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
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
          setValue("budgetGoal", data.budgetGoal?.toString() || "");
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

  const onSubmit = async (data: GoalSettingsData) => {
    setSaving(true);
    try {
      const response = await fetch("/api/users/settings", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${state.token}`,
        },
        body: JSON.stringify({
          budgetGoal: data.budgetGoal ? parseFloat(data.budgetGoal) : null,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save settings");
      }

      toast.success(
        t(
          "budgeting.goalSavedSuccessfully",
          "Goal saved successfully!",
        ),
      );
      onUpdate?.();
    } catch (error: any) {
      toast.error(
        error.message ||
          t("budgeting.failedToSaveGoal", "Failed to save goal"),
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
            {t("budgeting.overallGoal", "Overall Monthly Goal")}
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
      <CardHeader>
        <h3 className="text-xl font-semibold">
          {t("budgeting.overallGoal", "Overall Monthly Goal")}
        </h3>
      </CardHeader>
      <CardBody>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <PrimaryInput
              name="budgetGoal"
              label={t("budgeting.budgetGoal", "Monthly Budget Goal")}
              type="number"
              register={register}
              validation={{
                min: {
                  value: 0,
                  message: t(
                    "budgeting.budgetMustBePositive",
                    "Budget must be positive",
                  ),
                },
              }}
              errors={errors}
            />
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              {t(
                "budgeting.budgetGoalDescription",
                "Set your monthly budget goal to track spending",
              )}
            </p>
          </div>

          <div className="flex justify-end gap-4">
            <PrimaryButton
              text={t("budgeting.saveGoal", "Save Goal")}
              type="submit"
              isLoading={saving}
              color="bg-blue-500"
              styles="hover:bg-blue-600"
            />
          </div>
        </form>
      </CardBody>
    </Card>
  );
};
