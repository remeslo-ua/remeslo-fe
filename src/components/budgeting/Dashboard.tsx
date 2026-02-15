"use client";
import { useState, useEffect, useCallback } from "react";
import { Card, CardBody, CardHeader, Select, SelectItem } from "@nextui-org/react";
import { Chart } from "react-google-charts";
import { useAuthContext } from "@/providers/AuthProvider";
import { useTheme } from "@/providers/ThemeProvider";
import { useTranslations } from "@/hooks";

interface FinancialSummary {
  totalIncome: number;
  totalExpenses: number;
}

interface CategorySpending {
  name: string;
  color: string;
  total: number;
}

interface UserSettings {
  budgetGoal: number | null;
  currencySymbol: string;
  analyticsTimeRange: 'month' | 'year' | 'all-time';
}

export const Dashboard = () => {
  const { state } = useAuthContext();
  const { theme } = useTheme();
  const t = useTranslations();
  const [summary, setSummary] = useState<FinancialSummary | null>(null);
  const [categorySpending, setCategorySpending] = useState<CategorySpending[]>([]);
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState<UserSettings>({
    budgetGoal: null,
    currencySymbol: '$',
    analyticsTimeRange: 'month',
  });
  const [timeRange, setTimeRange] = useState<'month' | 'year' | 'all-time'>('month');

  const fetchSettings = useCallback(async () => {
    try {
      const response = await fetch('/api/users/settings', {
        headers: { "Authorization": `Bearer ${state.token}` },
      });

      if (response.ok) {
        const data = await response.json();
        const userSettings = {
          budgetGoal: data.budgetGoal || null,
          currencySymbol: data.currencySymbol || '$',
          analyticsTimeRange: data.analyticsTimeRange || 'month',
        };
        setSettings(userSettings);
        setTimeRange(userSettings.analyticsTimeRange);
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
    }
  }, [state.token]);

  const fetchSummary = useCallback(async () => {
    try {
      const currentDate = new Date();
      let startDate: Date | null = null;
      let endDate: Date | null = null;

      if (timeRange === 'month') {
        startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
      } else if (timeRange === 'year') {
        startDate = new Date(currentDate.getFullYear(), 0, 1);
        endDate = new Date(currentDate.getFullYear(), 11, 31);
      }

      const dateParams = new URLSearchParams();
      if (startDate) dateParams.set('startDate', startDate.toISOString());
      if (endDate) dateParams.set('endDate', endDate.toISOString());

      const paramsString = dateParams.toString();
      const expensesUrl = `/api/budgeting/expenses?limit=1000${paramsString ? `&${paramsString}` : ''}`;
      const incomeUrl = `/api/budgeting/income?limit=1000${paramsString ? `&${paramsString}` : ''}`;

      const [expensesRes, incomeRes] = await Promise.all([
        fetch(expensesUrl, {
          headers: { "Authorization": `Bearer ${state.token}` },
        }),
        fetch(incomeUrl, {
          headers: { "Authorization": `Bearer ${state.token}` },
        }),
      ]);

      if (expensesRes.ok && incomeRes.ok) {
        const expensesData = await expensesRes.json();
        const incomeData = await incomeRes.json();

        // Calculate totals
        const totalExpenses = expensesData.expenses.reduce((sum: number, exp: any) => sum + exp.amount, 0);
        const totalIncome = incomeData.income.reduce((sum: number, inc: any) => sum + inc.amount, 0);

        setSummary({
          totalIncome,
          totalExpenses,
        });

        const spendingMap = new Map<string, CategorySpending>();
        expensesData.expenses.forEach((expense: any) => {
          const categoryKey = expense.category?._id || 'uncategorized';
          const categoryName = expense.category?.name || t('budgeting.uncategorized', 'Uncategorized');
          const categoryColor = expense.category?.color || '#9CA3AF';
          const existing = spendingMap.get(categoryKey) || {
            name: categoryName,
            color: categoryColor,
            total: 0,
          };
          existing.total += expense.amount;
          spendingMap.set(categoryKey, existing);
        });

        const spendingList = Array.from(spendingMap.values()).sort((a, b) => b.total - a.total);
        setCategorySpending(spendingList);
      }
    } catch (error) {
      console.error("Error fetching summary:", error);
    } finally {
      setLoading(false);
    }
  }, [state.token, timeRange]);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  useEffect(() => {
    if (settings) {
      fetchSummary();
    }
  }, [fetchSummary, timeRange]);

  const formatCurrency = (amount: number) => {
    return `${settings.currencySymbol}${amount.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const getTimeRangeLabel = () => {
    if (timeRange === 'year') {
      return t('budgeting.year', 'Year');
    }
    if (timeRange === 'all-time') {
      return t('budgeting.allTime', 'All Time');
    }
    return t('budgeting.month', 'Month');
  };

  if (loading || !summary) return <div>{t('common.loading', 'Loading...')}</div>;

  const budgetGoal = settings.budgetGoal || 0;
  const hasBudgetGoal = settings.budgetGoal !== null && settings.budgetGoal > 0;

  const chartData = [
    ['Category', 'Income', 'Expenses', ...(hasBudgetGoal ? ['Budget Goal'] : [])],
    ['', summary.totalIncome, summary.totalExpenses, ...(hasBudgetGoal ? [budgetGoal] : [])],
  ];

  const spendingChartData = [
    [t('budgeting.category', 'Category'), t('budgeting.spending', 'Spending')],
    ...categorySpending.map((entry) => [entry.name, entry.total]),
  ];

  const options = {
    title: `${t('budgeting.incomeVsExpenses', 'Income vs Expenses')} (${getTimeRangeLabel()})`,
    colors: ['#10B981', '#EF4444', '#7b818a'],
    legend: { position: "bottom" as const },
    backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff',
    titleTextStyle: {
      color: theme === 'dark' ? '#ffffff' : '#000000',
    },
    hAxis: {
      textStyle: {
        color: theme === 'dark' ? '#d1d5db' : '#4b5563',
      },
    },
    vAxis: {
      textStyle: {
        color: theme === 'dark' ? '#d1d5db' : '#4b5563',
      },
      gridlines: {
        color: theme === 'dark' ? '#374151' : '#e5e7eb',
      },
    },
    chartArea: {
      backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff',
    },
  };

  return (
    <div className="space-y-6">
      <Card>
      <Chart
        chartType="BarChart"
        width="100%"
        height="400px"
        data={chartData}
        options={options}
      />
      </Card>
      {categorySpending.length > 0 && (
        <Card>
          <CardHeader>
            <h4 className="text-lg font-semibold">
              {t('budgeting.spendingByCategory', 'Spending by Category')}
            </h4>
          </CardHeader>
          <CardBody>
            <Chart
              chartType="PieChart"
              width="100%"
              height="380px"
              data={spendingChartData}
              options={{
                legend: { position: 'right' as const },
                backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff',
                pieHole: 0.35,
                chartArea: { width: '85%', height: '85%' },
                colors: categorySpending.map((entry) => entry.color),
              }}
            />
          </CardBody>
        </Card>
      )}
      {/* Budget Goal Card */}
      {hasBudgetGoal && (
        <Card>
          <CardHeader>
            <h4 className="text-lg font-semibold text-blue-600">{t('budgeting.monthlyBudgetGoal', 'Monthly Budget Goal')}</h4>
          </CardHeader>
          <CardBody>
            <p className="text-2xl font-bold text-blue-600">
              {formatCurrency(budgetGoal)}
            </p>
            <p className="text-sm text-gray-500">{t('budgeting.targetForThisMonth', 'Target for this month')}</p>
            {timeRange === 'month' && (
              <p className="text-sm text-gray-500">
                {t('budgeting.daysLeftInMonth', '{count} days left in this month').replace('{count}', getDaysLeftInMonth().toString())}
              </p>
            )}
            <div className="mt-2">
              <p className="text-sm">
                {t('budgeting.remaining', 'Remaining')}: {formatCurrency(Math.max(budgetGoal - summary.totalExpenses, 0))}
              </p>
              <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
                <div
                  className={`h-2.5 rounded-full ${
                    summary.totalExpenses > budgetGoal ? 'bg-red-600' : 'bg-blue-600'
                  }`}
                  style={{ width: `${Math.min((summary.totalExpenses / budgetGoal) * 100, 100)}%` }}
                ></div>
              </div>
              {summary.totalExpenses > budgetGoal && (
                <p className="text-sm text-red-600 mt-1">
                  {t('budgeting.overBudgetBy', 'Over budget by')} {formatCurrency(summary.totalExpenses - budgetGoal)}
                </p>
              )}
            </div>
          </CardBody>
        </Card>
      )}
    </div>
  );
};