 "use client";
import { useState, useEffect, useCallback } from "react";
import { useForm, Controller } from "react-hook-form";
import { PrimaryButton, PrimaryInput, CategorySelect } from "@/components/shared";
import { useAuthContext } from "@/providers/AuthProvider";
import { useTranslations } from "@/hooks";
import toast from "react-hot-toast";

interface Category {
  _id: string;
  name: string;
  type: 'expense' | 'income';
  color: string;
  isDefault: boolean;
}

interface ExpenseFormData {
  amount: string;
  note: string;
  category: string;
}

interface AddExpenseFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const AddExpenseForm = ({ onSuccess, onCancel }: AddExpenseFormProps) => {
  const { state } = useAuthContext();
  const t = useTranslations();
  const [notes, setNotes] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [notesFetched, setNotesFetched] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm<ExpenseFormData>();

  const fetchNotes = useCallback(async () => {
    try {
      const response = await fetch("/api/budgeting/expenses/notes", {
        headers: {
          "Authorization": `Bearer ${state.token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setNotes(data.notes || []);
      }
    } catch (error) {
      console.error("Error fetching notes:", error);
    } finally {
      setNotesFetched(true);
    }
  }, [state.token]);

  useEffect(() => {
    if (!notesFetched) {
      fetchNotes();
    }
  }, [notesFetched, fetchNotes]);

  const onSubmit = async (data: ExpenseFormData) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/budgeting/expenses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${state.token}`,
        },
        body: JSON.stringify({
          amount: data.amount,
          note: data.note,
          category: data.category,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || t('budgeting.failedToAddExpense', 'Failed to add expense'));
      }

      toast.success(t('budgeting.expenseAddedSuccessfully', 'Expense added successfully!'));
      reset();
      onSuccess?.();
    } catch (error: any) {
      toast.error(error.message || t('budgeting.failedToAddExpense', 'Failed to add expense'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <PrimaryInput
        name="amount"
        label={t('budgeting.expenseAmount', 'Expense Amount')}
        type="number"
        register={register}
        validation={{
          required: t('budgeting.amountRequired', 'Amount is required'),
          min: { value: 0.01, message: t('budgeting.amountMustBeGreater', 'Amount must be greater than 0') },
        }}
        errors={errors}
      />

      <Controller
        name="category"
        control={control}
        rules={{ required: t('budgeting.categoryRequired', 'Category is required') }}
        render={({ field }) => (
          <CategorySelect
            value={field.value}
            onChange={field.onChange}
            type="expense"
            label={t('budgeting.category', 'Category')}
            error={errors.category?.message}
          />
        )}
      />

      <div>
        <label className="block text-sm font-medium mb-1">{t('budgeting.note', 'Note')}</label>
        <input
          {...register("note", { required: t('budgeting.noteRequired', 'Note is required') })}
          list="notes-list"
          className="w-full p-2 border rounded-md"
          placeholder={t('budgeting.enterNote', 'Enter a note for this {type}').replace('{type}', t('budgeting.expenses', 'expense').toLowerCase())}
        />
        <datalist id="notes-list">
          {notes.map((note, index) => (
            <option key={index} value={note} />
          ))}
        </datalist>
        {errors.note && (
          <p className="text-red-500 text-sm mt-1">{errors.note.message}</p>
        )}
      </div>

      <div className="flex gap-4 justify-end">
        {onCancel && (
          <PrimaryButton
            text={t('common.cancel', 'Cancel')}
            type="button"
            color="bg-gray-500"
            styles="hover:bg-gray-600"
            onClick={onCancel}
          />
        )}
        <PrimaryButton
          text={t('budgeting.expenseAddButtonText', 'Add Expense')}
          type="submit"
          isLoading={isLoading}
          color="bg-red-500"
          styles="hover:bg-red-600"
        />
      </div>
    </form>
  );
};