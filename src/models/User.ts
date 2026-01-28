import mongoose from 'mongoose';

export interface IUser extends mongoose.Document {
  email: string;
  password: string;
  name?: string;
  role: 'user' | 'admin';
  accessibleApps: string[];
  theme?: 'light' | 'dark';
  language?: 'en' | 'uk';
  budgetGoal?: number;
  currencySymbol?: string;
  analyticsTimeRange?: 'month' | 'year' | 'all-time';
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    trim: true,
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  accessibleApps: [{
    type: String,
    enum: ['marketplace', 'hookah-picker', 'budgeting'],
  }],
  theme: {
    type: String,
    enum: ['light', 'dark'],
    default: 'light',
  },
  language: {
    type: String,
    enum: ['en', 'uk'],
    default: 'en',
  },
  budgetGoal: {
    type: Number,
    min: 0,
  },
  currencySymbol: {
    type: String,
    default: '$',
  },
  analyticsTimeRange: {
    type: String,
    enum: ['month', 'year', 'all-time'],
    default: 'month',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update the updatedAt field before saving
UserSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

const User = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
export default User;