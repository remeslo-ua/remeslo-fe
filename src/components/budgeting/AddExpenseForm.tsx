 "use client";
import { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { PrimaryButton } from "../marketplace/common/primary/PrimaryButton";
import { PrimaryInput } from "../marketplace/common/primary/PrimaryInput";
import { PrimaryTextarea } from "../marketplace/common/primary/PrimaryTextarea";
import { useAuthContext } from "@/providers/AuthProvider";
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
}

interface AddExpenseFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const AddExpenseForm = ({ onSuccess, onCancel }: AddExpenseFormProps) => {
  const { state } = useAuthContext();
  const [notes, setNotes] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [notesFetched, setNotesFetched] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
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
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to add expense");
      }

      toast.success("Expense added successfully!");
      reset();
      onSuccess?.();
    } catch (error: any) {
      toast.error(error.message || "Failed to add expense");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <PrimaryInput
        name="amount"
        label="Expense Amount"
        type="number"
        register={register}
        validation={{
          required: "Amount is required",
          min: { value: 0.01, message: "Amount must be greater than 0" },
        }}
        errors={errors}
      />

      <div>
        <label className="block text-sm font-medium mb-1">Note</label>
        <input
          {...register("note", { required: "Note is required" })}
          list="notes-list"
          className="w-full p-2 border rounded-md"
          placeholder="Enter a note for this expense"
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
            text="Cancel"
            type="button"
            color="bg-gray-500"
            styles="hover:bg-gray-600"
            onClick={onCancel}
          />
        )}
        <PrimaryButton
          text="Add Expense"
          type="submit"
          isLoading={isLoading}
          color="bg-red-500"
          styles="hover:bg-red-600"
        />
      </div>
    </form>
  );
};