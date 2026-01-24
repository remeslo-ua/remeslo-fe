"use client";
import { useState, useEffect, useCallback } from "react";
import { Card, CardBody, CardHeader } from "@nextui-org/react";
import { PrimaryButton } from "../marketplace/common/primary/PrimaryButton";
import { useAuthContext } from "@/providers/AuthProvider";

interface Category {
  _id: string;
  name: string;
  color: string;
}

interface Transaction {
  _id: string;
  amount: number;
  note: string;
  category?: Category;
  date: string;
  paymentMethod: string;
  vendor?: string;
  client?: string;
  project?: string;
  status?: string;
}

interface TransactionsListProps {
  type: 'expense' | 'income';
  title: string;
}

export const TransactionsList = ({ type, title }: TransactionsListProps) => {
  const { state } = useAuthContext();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchTransactions = useCallback(async () => {
    try {
      const response = await fetch(`/api/budgeting/${type === 'expense' ? 'expenses' : 'income'}?page=${page}&limit=10`, {
        headers: {
          "Authorization": `Bearer ${state.token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setTransactions(data[type === 'expense' ? 'expenses' : 'income']);
        setTotalPages(data.pagination.pages);
      }
    } catch (error) {
      console.error(`Error fetching ${type}s:`, error);
    } finally {
      setLoading(false);
    }
  }, [type, page, state.token]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <h3 className="text-xl font-semibold">{title}</h3>
        </CardHeader>
        <CardBody>
          <div className="text-center py-8">Loading...</div>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <h3 className="text-xl font-semibold">{title}</h3>
      </CardHeader>
      <CardBody>
        {transactions.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No {type}s recorded yet. Add your first {type} above.
          </div>
        ) : (
          <div className="space-y-4">
            {transactions.map((transaction) => (
              <div
                key={transaction._id}
                className="border rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-3">
                    {transaction.category && (
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: transaction.category.color }}
                      />
                    )}
                    <h4 className="font-medium">{transaction.note}</h4>
                  </div>
                  <div className={`font-bold ${type === 'expense' ? 'text-red-600' : 'text-green-600'}`}>
                    {type === 'expense' ? '-' : '+'}{formatCurrency(transaction.amount)}
                  </div>
                </div>

                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                  {transaction.category && <span>{transaction.category.name}</span>}
                  <span>{formatDate(transaction.date)}</span>
                  <span className="capitalize">{transaction.paymentMethod}</span>
                  {transaction.vendor && <span>Vendor: {transaction.vendor}</span>}
                  {transaction.client && <span>Client: {transaction.client}</span>}
                  {transaction.project && <span>Project: {transaction.project}</span>}
                  {transaction.status && (
                    <span className={`px-2 py-1 rounded text-xs ${
                      transaction.status === 'received' ? 'bg-green-100 text-green-800' :
                      transaction.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {transaction.status}
                    </span>
                  )}
                </div>
              </div>
            ))}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-6">
                <PrimaryButton
                  text="Previous"
                  type="button"
                  color="bg-gray-500"
                  styles="hover:bg-gray-600"
                  onClick={() => setPage(Math.max(1, page - 1))}
                  isDisabled={page === 1}
                />
                <span className="px-4 py-2 bg-gray-100 rounded">
                  Page {page} of {totalPages}
                </span>
                <PrimaryButton
                  text="Next"
                  type="button"
                  color="bg-gray-500"
                  styles="hover:bg-gray-600"
                  onClick={() => setPage(Math.min(totalPages, page + 1))}
                  isDisabled={page === totalPages}
                />
              </div>
            )}
          </div>
        )}
      </CardBody>
    </Card>
  );
};