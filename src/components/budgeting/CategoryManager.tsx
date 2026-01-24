"use client";
import { useState, useEffect } from "react";
import { Card, CardBody, CardHeader } from "@nextui-org/react";
import { PrimaryButton } from "../marketplace/common/primary/PrimaryButton";
import { PrimaryInput } from "../marketplace/common/primary/PrimaryInput";
import { useAuthContext } from "@/providers/AuthProvider";
import toast from "react-hot-toast";

interface Category {
  _id: string;
  name: string;
  type: 'expense' | 'income';
  color: string;
  isDefault: boolean;
}

interface CategoryManagerProps {
  onClose?: () => void;
}

export const CategoryManager = ({ onClose }: CategoryManagerProps) => {
  const { state } = useAuthContext();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: 'expense' as 'expense' | 'income',
    color: '#3B82F6',
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/budgeting/categories", {
        headers: {
          "Authorization": `Bearer ${state.token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setCategories(data.categories);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/budgeting/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${state.token}`,
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to create category");
      }

      toast.success("Category created successfully!");
      setFormData({ name: '', type: 'expense', color: '#3B82F6' });
      setShowForm(false);
      fetchCategories();
    } catch (error: any) {
      toast.error(error.message || "Failed to create category");
    }
  };

  const deleteCategory = async (categoryId: string, isDefault: boolean) => {
    if (isDefault) {
      toast.error("Cannot delete default categories");
      return;
    }

    if (!confirm("Are you sure you want to delete this category?")) {
      return;
    }

    try {
      const response = await fetch(`/api/budgeting/categories?id=${categoryId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${state.token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete category");
      }

      toast.success("Category deleted successfully!");
      fetchCategories();
    } catch (error: any) {
      toast.error(error.message || "Failed to delete category");
    }
  };

  const expenseCategories = categories.filter(cat => cat.type === 'expense');
  const incomeCategories = categories.filter(cat => cat.type === 'income');

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <h3 className="text-xl font-semibold">Category Manager</h3>
        </CardHeader>
        <CardBody>
          <div className="text-center py-8">Loading categories...</div>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">Category Manager</h3>
        <div className="flex gap-2">
          <PrimaryButton
            text={showForm ? "Cancel" : "Add Category"}
            type="button"
            color={showForm ? "bg-gray-500" : "bg-blue-500"}
            styles="hover:bg-blue-600"
            onClick={() => setShowForm(!showForm)}
          />
          {onClose && (
            <PrimaryButton
              text="Close"
              type="button"
              color="bg-gray-500"
              styles="hover:bg-gray-600"
              onClick={onClose}
            />
          )}
        </div>
      </CardHeader>
      <CardBody>
        {showForm && (
          <form onSubmit={handleSubmit} className="mb-6 p-4 border rounded-lg bg-gray-50">
            <h4 className="text-lg font-medium mb-4">Create New Category</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Category Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-2 border rounded-md"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as 'expense' | 'income' })}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="expense">Expense</option>
                  <option value="income">Income</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Color</label>
                <input
                  type="color"
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  className="w-full p-2 border rounded-md h-10"
                />
              </div>
            </div>

            <div className="flex justify-end mt-4">
              <PrimaryButton
                text="Create Category"
                type="submit"
                color="bg-green-500"
                styles="hover:bg-green-600"
              />
            </div>
          </form>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Expense Categories */}
          <div>
            <h4 className="text-lg font-medium mb-4">Expense Categories</h4>
            <div className="space-y-2">
              {expenseCategories.map((category) => (
                <div
                  key={category._id}
                  className="flex items-center justify-between p-3 rounded-lg border"
                  style={{ borderColor: category.color }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: category.color }}
                    />
                    <span>{category.name}</span>
                    {category.isDefault && (
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        Default
                      </span>
                    )}
                  </div>
                  {!category.isDefault && (
                    <button
                      onClick={() => deleteCategory(category._id, category.isDefault)}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      Delete
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Income Categories */}
          <div>
            <h4 className="text-lg font-medium mb-4">Income Categories</h4>
            <div className="space-y-2">
              {incomeCategories.map((category) => (
                <div
                  key={category._id}
                  className="flex items-center justify-between p-3 rounded-lg border"
                  style={{ borderColor: category.color }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: category.color }}
                    />
                    <span>{category.name}</span>
                    {category.isDefault && (
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        Default
                      </span>
                    )}
                  </div>
                  {!category.isDefault && (
                    <button
                      onClick={() => deleteCategory(category._id, category.isDefault)}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      Delete
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};