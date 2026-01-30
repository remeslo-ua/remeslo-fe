"use client";
import { useState, useEffect, useCallback } from "react";
import { Card, CardBody, CardHeader, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@nextui-org/react";
import { PrimaryButton } from "@/components/shared";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { useAuthContext } from "@/providers/AuthProvider";
import { useTranslations } from "@/hooks";
import toast from "react-hot-toast";

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
  const t = useTranslations();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; transactionId?: string }>({ isOpen: false });
  const [deleting, setDeleting] = useState(false);

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

  const deleteTransaction = async (transactionId: string) => {
    setDeleting(true);
    try {
      const endpoint = type === 'expense' ? 'expenses' : 'income';
      const response = await fetch(`/api/budgeting/${endpoint}/${transactionId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${state.token}`,
        },
      });

      if (response.ok) {
        toast.success(t('budgeting.deletedSuccessfully', '{type} deleted successfully').replace('{type}', type.charAt(0).toUpperCase() + type.slice(1)));
        setDeleteConfirm({ isOpen: false });
        fetchTransactions();
      } else {
        toast.error(t('budgeting.failedToDelete', 'Failed to delete transaction'));
      }
    } catch (error) {
      console.error('Error deleting transaction:', error);
      toast.error(t('budgeting.failedToDelete', 'Failed to delete transaction'));
    } finally {
      setDeleting(false);
    }
  };

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
          <div className="text-center py-8">{t('common.loading', 'Loading...')}</div>
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
            {type === 'expense' ? t('budgeting.noExpensesYet', 'No expenses recorded yet. Add your first expense above.') : t('budgeting.noIncomeYet', 'No income recorded yet. Add your first income above.')}
          </div>
        ) : (
          <div className="space-y-4">
            {transactions.map((transaction) => (
              <div
                key={transaction._id}
                className="border rounded-lg p-4 hover:shadow-md transition-shadow flex justify-between items-start"
              >
                <div className="flex-1">
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

                  <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
                    {transaction.category && <span>{transaction.category.name}</span>}
                    <span>{formatDate(transaction.date)}</span>
                    <span className="capitalize">{transaction.paymentMethod}</span>
                    {transaction.vendor && <span>{t('budgeting.vendor', 'Vendor')}: {transaction.vendor}</span>}
                    {transaction.client && <span>{t('budgeting.client', 'Client')}: {transaction.client}</span>}
                    {transaction.project && <span>{t('budgeting.project', 'Project')}: {transaction.project}</span>}
                    {transaction.status && (
                      <span className={`px-2 py-1 rounded text-xs ${
                        transaction.status === 'received' ? 'bg-green-100 text-green-800' :
                        transaction.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {transaction.status === 'received' ? t('budgeting.received', 'Received') :
                         transaction.status === 'pending' ? t('budgeting.pending', 'Pending') :
                         transaction.status}
                      </span>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => setDeleteConfirm({ isOpen: true, transactionId: transaction._id })}
                  className="ml-4 p-2 text-red-500 hover:bg-red-100 dark:hover:bg-red-900 rounded transition-colors"
                  aria-label="Delete transaction"
                >
                  <FontAwesomeIcon icon={faTrash} className="w-4 h-4" />
                </button>
              </div>
            ))}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-6">
                <PrimaryButton
                  text={t('common.previous', 'Previous')}
                  type="button"
                  color="bg-gray-500"
                  styles="hover:bg-gray-600"
                  onClick={() => setPage(Math.max(1, page - 1))}
                  isDisabled={page === 1}
                />
                <span className="px-4 py-2 bg-gray-100 rounded">
                  {t('budgeting.pageOf', 'Page {page} of {total}').replace('{page}', page.toString()).replace('{total}', totalPages.toString())}
                </span>
                <PrimaryButton
                  text={t('common.next', 'Next')}
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

      {/* Delete Confirmation Modal */}
      <Modal isOpen={deleteConfirm.isOpen} onClose={() => setDeleteConfirm({ isOpen: false })}>
        <ModalContent>
          <ModalHeader>
            <h3 className="text-lg font-semibold">{t('budgeting.confirmDelete', 'Confirm Delete')}</h3>
          </ModalHeader>
          <ModalBody>
            <p>{t('budgeting.areYouSureDelete', 'Are you sure you want to delete this {type}? This action cannot be undone.').replace('{type}', type)}</p>
          </ModalBody>
          <ModalFooter>
            <PrimaryButton
              text={t('common.cancel', 'Cancel')}
              type="button"
              color="bg-gray-500"
              styles="hover:bg-gray-600"
              onClick={() => setDeleteConfirm({ isOpen: false })}
            />
            <PrimaryButton
              text={t('common.delete', 'Delete')}
              type="button"
              color="bg-red-600"
              styles="hover:bg-red-700"
              isLoading={deleting}
              onClick={() => deleteConfirm.transactionId && deleteTransaction(deleteConfirm.transactionId)}
            />
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Card>
  );
};
