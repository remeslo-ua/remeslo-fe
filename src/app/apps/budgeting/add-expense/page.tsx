"use client";
import { AddExpenseForm } from "../../../../components/budgeting/AddExpenseForm";
import { useRouter } from "next/navigation";
import AuthGuard from "../../../../components/AuthGuard";

export default function AddExpensePage() {
  const router = useRouter();

  const handleSuccess = () => {
    router.push("/apps/budgeting");
  };

  const handleCancel = () => {
    router.push("/apps/budgeting");
  };

  return (
    <AuthGuard>
      <div className="min-h-screen p-8">
        <div className="max-w-md mx-auto">
          <button
            onClick={() => router.back()}
            className="mb-4 text-gray-600 hover:text-gray-800 active:bg-gray-200 active:text-gray-900 p-2 rounded flex items-center"
          >
            <span className="text-xl mr-2">{'<'}</span> Back
          </button>
          <h1 className="text-2xl font-bold mb-6">Add Expense</h1>
          <AddExpenseForm onSuccess={handleSuccess} onCancel={handleCancel} />
        </div>
      </div>
    </AuthGuard>
  );
}