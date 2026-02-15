"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
} from "@nextui-org/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import toast from "react-hot-toast";
import { PrimaryButton } from "@/components/shared";
import { useAuthContext } from "@/providers/AuthProvider";
import { useTranslations } from "@/hooks";

interface Category {
  _id: string;
  name: string;
  color: string;
  type: "expense" | "income";
}

interface Transaction {
  _id: string;
  amount: number;
  note: string;
  category?: Category;
  date: string;
  paymentMethod?: string;
  vendor?: string;
  client?: string;
  project?: string;
  status?: string;
  type: "expense" | "income";
}

interface CategoryOption {
  id: string;
  name: string;
  color?: string;
  isAll?: boolean;
}

interface TransactionsFeedProps {
  title: string;
}

const PAGE_SIZE = 10;

export const TransactionsFeed = ({ title }: TransactionsFeedProps) => {
  const { state } = useAuthContext();
  const t = useTranslations();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [typeFilter, setTypeFilter] = useState<"all" | "expense" | "income">("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; transactionId?: string; type?: "expense" | "income" }>({
    isOpen: false,
  });
  const [deleting, setDeleting] = useState(false);

  const visibleCategories = useMemo(() => {
    if (typeFilter === "all") {
      return categories;
    }
    return categories.filter((category) => category.type === typeFilter);
  }, [categories, typeFilter]);

  const categoryOptions = useMemo<CategoryOption[]>(
    () => [
      {
        id: "all",
        name: t("budgeting.allCategories", "All categories"),
        isAll: true,
      },
      ...visibleCategories.map((category) => ({
        id: category._id,
        name: category.name,
        color: category.color,
      })),
    ],
    [t, visibleCategories]
  );

  const fetchCategories = useCallback(async () => {
    try {
      const response = await fetch("/api/budgeting/categories", {
        headers: {
          Authorization: `Bearer ${state.token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setCategories(data.categories || []);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  }, [state.token]);

  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set("page", page.toString());
      params.set("limit", PAGE_SIZE.toString());
      params.set("type", typeFilter);
      if (categoryFilter !== "all") {
        params.set("category", categoryFilter);
      }

      const response = await fetch(`/api/budgeting/transactions?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${state.token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setTransactions(data.transactions || []);
        setTotalPages(data.pagination?.pages || 1);
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setLoading(false);
    }
  }, [page, typeFilter, categoryFilter, state.token]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  useEffect(() => {
    setPage(1);
  }, [typeFilter, categoryFilter]);

  useEffect(() => {
    if (categoryFilter === "all") return;
    const stillVisible = visibleCategories.some((category) => category._id === categoryFilter);
    if (!stillVisible) {
      setCategoryFilter("all");
    }
  }, [categoryFilter, visibleCategories]);

  const deleteTransaction = async (transactionId: string, type: "expense" | "income") => {
    setDeleting(true);
    try {
      const endpoint = type === "expense" ? "expenses" : "income";
      const response = await fetch(`/api/budgeting/${endpoint}/${transactionId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${state.token}`,
        },
      });

      if (response.ok) {
        toast.success(
          t("budgeting.deletedSuccessfully", "{type} deleted successfully").replace(
            "{type}",
            type.charAt(0).toUpperCase() + type.slice(1)
          )
        );
        setDeleteConfirm({ isOpen: false });
        fetchTransactions();
      } else {
        toast.error(t("budgeting.failedToDelete", "Failed to delete transaction"));
      }
    } catch (error) {
      console.error("Error deleting transaction:", error);
      toast.error(t("budgeting.failedToDelete", "Failed to delete transaction"));
    } finally {
      setDeleting(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const getTypeLabel = (type: "expense" | "income") => {
    return type === "expense"
      ? t("budgeting.expenses", "Expenses")
      : t("budgeting.income", "Income");
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <h3 className="text-xl font-semibold">{title}</h3>
        </CardHeader>
        <CardBody>
          <div className="text-center py-8">{t("common.loading", "Loading...")}</div>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-4 w-full">
          <h3 className="text-xl font-semibold">{title}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label={t("budgeting.filterType", "Type")}
              selectedKeys={[typeFilter]}
              onChange={(event) => setTypeFilter(event.target.value as "all" | "expense" | "income")}
              variant="bordered"
            >
              <SelectItem key="all" value="all">
                {t("budgeting.allTypes", "All types")}
              </SelectItem>
              <SelectItem key="expense" value="expense">
                {t("budgeting.expenses", "Expenses")}
              </SelectItem>
              <SelectItem key="income" value="income">
                {t("budgeting.income", "Income")}
              </SelectItem>
            </Select>
            <Select
              label={t("budgeting.filterCategory", "Category")}
              selectedKeys={[categoryFilter]}
              onChange={(event) => setCategoryFilter(event.target.value)}
              variant="bordered"
              items={categoryOptions}
            >
              {(item) => (
                <SelectItem key={item.id} value={item.id} textValue={item.name}>
                  {item.isAll ? (
                    item.name
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                      <span>{item.name}</span>
                    </div>
                  )}
                </SelectItem>
              )}
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardBody>
        {transactions.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            {t("budgeting.noTransactionsYet", "No transactions recorded yet.")}
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
                      <div>
                        <h4 className="font-medium">{transaction.note}</h4>
                        <p className="text-xs uppercase text-gray-500">{getTypeLabel(transaction.type)}</p>
                      </div>
                    </div>
                    <div
                      className={`font-bold ${transaction.type === "expense" ? "text-red-600" : "text-green-600"}`}
                    >
                      {transaction.type === "expense" ? "-" : "+"}
                      {formatCurrency(transaction.amount)}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
                    {transaction.category && <span>{transaction.category.name}</span>}
                    <span>{formatDate(transaction.date)}</span>
                    {transaction.paymentMethod && <span className="capitalize">{transaction.paymentMethod}</span>}
                    {transaction.vendor && <span>{t("budgeting.vendor", "Vendor")}: {transaction.vendor}</span>}
                    {transaction.client && <span>{t("budgeting.client", "Client")}: {transaction.client}</span>}
                    {transaction.project && <span>{t("budgeting.project", "Project")}: {transaction.project}</span>}
                    {transaction.status && (
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          transaction.status === "received"
                            ? "bg-green-100 text-green-800"
                            : transaction.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {transaction.status === "received"
                          ? t("budgeting.received", "Received")
                          : transaction.status === "pending"
                          ? t("budgeting.pending", "Pending")
                          : transaction.status}
                      </span>
                    )}
                  </div>
                </div>
                <button
                  onClick={() =>
                    setDeleteConfirm({
                      isOpen: true,
                      transactionId: transaction._id,
                      type: transaction.type,
                    })
                  }
                  className="ml-4 p-2 text-red-500 hover:bg-red-100 dark:hover:bg-red-900 rounded transition-colors"
                  aria-label="Delete transaction"
                >
                  <FontAwesomeIcon icon={faTrash} className="w-4 h-4" />
                </button>
              </div>
            ))}

            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-6">
                <PrimaryButton
                  text={t("common.previous", "Previous")}
                  type="button"
                  color="bg-gray-500"
                  styles="hover:bg-gray-600"
                  onClick={() => setPage(Math.max(1, page - 1))}
                  isDisabled={page === 1}
                />
                <span className="px-4 py-2 bg-gray-100 rounded">
                  {t("budgeting.pageOf", "Page {page} of {total}")
                    .replace("{page}", page.toString())
                    .replace("{total}", totalPages.toString())}
                </span>
                <PrimaryButton
                  text={t("common.next", "Next")}
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

      <Modal isOpen={deleteConfirm.isOpen} onClose={() => setDeleteConfirm({ isOpen: false })}>
        <ModalContent>
          <ModalHeader>
            <h3 className="text-lg font-semibold">{t("budgeting.confirmDelete", "Confirm Delete")}</h3>
          </ModalHeader>
          <ModalBody>
            <p>
              {t("budgeting.areYouSureDelete", "Are you sure you want to delete this {type}? This action cannot be undone.")
                .replace("{type}", deleteConfirm.type || "transaction")}
            </p>
          </ModalBody>
          <ModalFooter>
            <PrimaryButton
              text={t("common.cancel", "Cancel")}
              type="button"
              color="bg-gray-500"
              styles="hover:bg-gray-600"
              onClick={() => setDeleteConfirm({ isOpen: false })}
            />
            <PrimaryButton
              text={t("common.delete", "Delete")}
              type="button"
              color="bg-red-600"
              styles="hover:bg-red-700"
              isLoading={deleting}
              onClick={() =>
                deleteConfirm.transactionId && deleteConfirm.type
                  ? deleteTransaction(deleteConfirm.transactionId, deleteConfirm.type)
                  : null
              }
            />
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Card>
  );
};
