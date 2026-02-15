import mongoose, { Schema, Document } from 'mongoose';

export interface ICategoryGoal extends Document {
  userId: mongoose.Types.ObjectId;
  categoryId: mongoose.Types.ObjectId;
  monthlyLimit: number;
  createdAt: Date;
  updatedAt: Date;
}

const categoryGoalSchema = new Schema<ICategoryGoal>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    monthlyLimit: {
      type: Number,
      required: true,
      min: [0, 'Monthly limit cannot be negative'],
    },
  },
  {
    timestamps: true,
  }
);

// Ensure unique goal per user per category
categoryGoalSchema.index({ userId: 1, categoryId: 1 }, { unique: true });

const CategoryGoal =
  mongoose.models.CategoryGoal ||
  mongoose.model<ICategoryGoal>('CategoryGoal', categoryGoalSchema);

export default CategoryGoal;
