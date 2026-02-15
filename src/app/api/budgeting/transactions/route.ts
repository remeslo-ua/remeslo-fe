import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import dbConnect from "@/lib/mongodb";
import Expense from "@/models/Expense";
import Income from "@/models/Income";
import { getUserFromToken } from "@/lib/auth";

const DEFAULT_LIMIT = 10;

const buildPagination = (page: number, limit: number, total: number) => ({
  page,
  limit,
  total,
  pages: Math.ceil(total / limit),
});

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const authUser = getUserFromToken(request);
    if (!authUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const type = (searchParams.get("type") || "all") as "all" | "expense" | "income";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || DEFAULT_LIMIT.toString());
    const category = searchParams.get("category");

    if (!Number.isFinite(page) || page < 1 || !Number.isFinite(limit) || limit < 1) {
      return NextResponse.json({ error: "Invalid pagination" }, { status: 400 });
    }

    if (!["all", "expense", "income"].includes(type)) {
      return NextResponse.json({ error: "Type must be all, expense, or income" }, { status: 400 });
    }

    const userId = new mongoose.Types.ObjectId(authUser.userId);
    if (category && !mongoose.Types.ObjectId.isValid(category)) {
      return NextResponse.json({ error: "Invalid category" }, { status: 400 });
    }
    const categoryId = category ? new mongoose.Types.ObjectId(category) : null;

    if (type === "expense") {
      const query: Record<string, any> = { userId };
      if (categoryId) {
        query.category = categoryId;
      }

      const [expenses, total] = await Promise.all([
        Expense.find(query)
          .populate("category", "name color type")
          .sort({ date: -1 })
          .limit(limit)
          .skip((page - 1) * limit),
        Expense.countDocuments(query),
      ]);

      const transactions = expenses.map((expense) => {
        const item = expense.toObject();
        return {
          ...item,
          type: "expense",
          note: item.note,
        };
      });

      return NextResponse.json({
        transactions,
        pagination: buildPagination(page, limit, total),
      });
    }

    if (type === "income") {
      const query: Record<string, any> = { userId };
      if (categoryId) {
        query.category = categoryId;
      }

      const [income, total] = await Promise.all([
        Income.find(query)
          .populate("category", "name color type")
          .sort({ date: -1 })
          .limit(limit)
          .skip((page - 1) * limit),
        Income.countDocuments(query),
      ]);

      const transactions = income.map((entry) => {
        const item = entry.toObject();
        return {
          ...item,
          type: "income",
          note: item.description,
        };
      });

      return NextResponse.json({
        transactions,
        pagination: buildPagination(page, limit, total),
      });
    }

    const expenseMatch: Record<string, any> = { userId };
    const incomeMatch: Record<string, any> = { userId };

    if (categoryId) {
      expenseMatch.category = categoryId;
      incomeMatch.category = categoryId;
    }

    const expensePipeline = [
      { $match: expenseMatch },
      {
        $lookup: {
          from: "categories",
          localField: "category",
          foreignField: "_id",
          as: "category",
        },
      },
      { $unwind: { path: "$category", preserveNullAndEmptyArrays: true } },
      { $addFields: { type: "expense", note: "$note" } },
    ];

    const incomePipeline = [
      { $match: incomeMatch },
      {
        $lookup: {
          from: "categories",
          localField: "category",
          foreignField: "_id",
          as: "category",
        },
      },
      { $unwind: { path: "$category", preserveNullAndEmptyArrays: true } },
      { $addFields: { type: "income", note: "$description" } },
    ];

    const aggregated = await Expense.aggregate([
      ...expensePipeline,
      {
        $unionWith: {
          coll: Income.collection.name,
          pipeline: incomePipeline,
        },
      },
      { $sort: { date: -1 } },
      {
        $facet: {
          items: [{ $skip: (page - 1) * limit }, { $limit: limit }],
          total: [{ $count: "count" }],
        },
      },
    ]);

    const items = aggregated[0]?.items || [];
    const total = aggregated[0]?.total?.[0]?.count || 0;

    return NextResponse.json({
      transactions: items,
      pagination: buildPagination(page, limit, total),
    });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
