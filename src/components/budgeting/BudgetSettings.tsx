'use client';

import { useState, useEffect } from 'react';
import { Card, CardBody, CardHeader, Select, SelectItem } from '@nextui-org/react';
import { PrimaryButton, PrimaryInput, ThemeSwitch } from '@/components/shared';
import { useForm, Controller } from 'react-hook-form';
import { useAuthContext } from '@/providers/AuthProvider';
import toast from 'react-hot-toast';

interface SettingsFormData {
  budgetGoal: string;
  currencySymbol: string;
  analyticsTimeRange: 'month' | 'year' | 'all-time';
}

interface BudgetSettingsProps {
  onClose?: () => void;
  onUpdate?: () => void;
}

export const BudgetSettings = ({ onClose, onUpdate }: BudgetSettingsProps) => {
  const { state } = useAuthContext();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    control,
  } = useForm<SettingsFormData>({
    defaultValues: {
      budgetGoal: '',
      currencySymbol: '$',
      analyticsTimeRange: 'month',
    },
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/users/settings', {
        headers: {
          'Authorization': `Bearer ${state.token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setValue('budgetGoal', data.budgetGoal?.toString() || '');
        setValue('currencySymbol', data.currencySymbol || '$');
        setValue('analyticsTimeRange', data.analyticsTimeRange || 'month');
      }
    } catch (error) {
      console.error('Failed to fetch settings:', error);
      toast.error('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: SettingsFormData) => {
    setSaving(true);
    try {
      const response = await fetch('/api/users/settings', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${state.token}`,
        },
        body: JSON.stringify({
          budgetGoal: data.budgetGoal ? parseFloat(data.budgetGoal) : null,
          currencySymbol: data.currencySymbol,
          analyticsTimeRange: data.analyticsTimeRange,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save settings');
      }

      toast.success('Settings saved successfully!');
      onUpdate?.();
      onClose?.();
    } catch (error: any) {
      toast.error(error.message || 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <h3 className="text-xl font-semibold">Budget Settings</h3>
        </CardHeader>
        <CardBody>
          <div className="text-center py-8">Loading settings...</div>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card className="shadow-none border-0">
      <CardBody>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Theme Toggle */}
          <div className="flex items-center justify-between p-4 border rounded-lg bg-gray-50 dark:bg-gray-800">
            <div>
              <h4 className="text-lg font-semibold mb-1">Theme</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">Switch between light and dark mode</p>
            </div>
            <ThemeSwitch />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <PrimaryInput
                name="budgetGoal"
                label="Monthly Budget Goal"
                type="number"
                register={register}
                validation={{
                  min: { value: 0, message: 'Budget must be positive' },
                }}
                errors={errors}
              />
              <p className="text-sm text-gray-500 mt-1">
                Set your monthly budget goal to track spending
              </p>
            </div>

            <div>
              <PrimaryInput
                name="currencySymbol"
                label="Currency Symbol"
                type="text"
                register={register}
                validation={{
                  required: 'Currency symbol is required',
                  maxLength: { value: 5, message: 'Max 5 characters' },
                }}
                errors={errors}
              />
              <p className="text-sm text-gray-500 mt-1">
                E.g., $, €, £, ₹, or any custom symbol
              </p>
            </div>
          </div>

          <div>
            <Controller
              name="analyticsTimeRange"
              control={control}
              render={({ field }) => (
                <div className="mb-5">
                  <Select
                    label="Analytics Time Range"
                    selectedKeys={[field.value]}
                    onChange={(e) => field.onChange(e.target.value)}
                    variant="bordered"
                    classNames={{
                      trigger: ['border-2 border-black-200 h-[62px] bg-[#FFFFFF]'],
                    }}
                  >
                    <SelectItem key="month" value="month">
                      Current Month
                    </SelectItem>
                    <SelectItem key="year" value="year">
                      Current Year
                    </SelectItem>
                    <SelectItem key="all-time" value="all-time">
                      All Time
                    </SelectItem>
                  </Select>
                  <p className="text-sm text-gray-500 mt-1">
                    Default time range for dashboard analytics
                  </p>
                </div>
              )}
            />
          </div>

          <div className="flex justify-end gap-4">
            {onClose && (
              <PrimaryButton
                text="Cancel"
                type="button"
                color="bg-gray-500"
                styles="hover:bg-gray-600"
                onClick={onClose}
              />
            )}
            <PrimaryButton
              text="Save Settings"
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
