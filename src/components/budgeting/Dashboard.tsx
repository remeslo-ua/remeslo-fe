"use client";
import { useState, useEffect } from "react";
import { Card, CardBody, CardHeader } from "@nextui-org/react";
import { Chart } from "react-google-charts";
import { useAuthContext } from "@/providers/AuthProvider";

interface FinancialSummary {
  totalIncome: number;
  totalExpenses: number;
}

export const Dashboard = () => {
  const { state } = useAuthContext();
  const [summary, setSummary] = useState<FinancialSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [budgetGoal, setBudgetGoal] = useState(5000); // Monthly budget goal, hardcoded for now

  useEffect(() => {
    fetchSummary();
  }, []);

  const fetchSummary = async () => {
    try {
      // Fetch expenses and income for current month
      const currentDate = new Date();
      const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

      const [expensesRes, incomeRes] = await Promise.all([
        fetch(`/api/budgeting/expenses?startDate=${startOfMonth.toISOString()}&endDate=${endOfMonth.toISOString()}`, {
          headers: { "Authorization": `Bearer ${state.token}` },
        }),
        fetch(`/api/budgeting/income?startDate=${startOfMonth.toISOString()}&endDate=${endOfMonth.toISOString()}`, {
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
      }
    } catch (error) {
      console.error("Error fetching summary:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  if (loading || !summary) return <div>Loading...</div>;

  const chartData = [
    ['test', 'Income', 'Expenses', 'Budget Goal'],
    ['', summary.totalIncome, summary.totalExpenses, budgetGoal],
    // ['Remaining', budgetGoal - summary.totalExpenses, budgetGoal],
  ];

  const options = {
    title: 'Income vs Expenses',
    colors: ['#10B981', '#EF4444', '#7b818a'],
    legend: { position: "bottom" },
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
      {/* Budget Goal Card */}
      <Card>
        <CardHeader>
          <h4 className="text-lg font-semibold text-blue-600">Monthly Budget Goal</h4>
        </CardHeader>
        <CardBody>
          <p className="text-2xl font-bold text-blue-600">
            {formatCurrency(budgetGoal)}
          </p>
          <p className="text-sm text-gray-500">Target for this month</p>
          <div className="mt-2">
            <p className="text-sm">
              Remaining: {formatCurrency(budgetGoal - summary.totalExpenses)}
            </p>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
              <div
                className="bg-blue-600 h-2.5 rounded-full"
                style={{ width: `${Math.min((summary.totalExpenses / budgetGoal) * 100, 100)}%` }}
              ></div>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};