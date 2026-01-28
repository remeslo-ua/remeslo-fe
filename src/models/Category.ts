import mongoose from 'mongoose';

const CategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  type: {
    type: String,
    enum: ['expense', 'income'],
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null, // null for default categories
  },
  isDefault: {
    type: Boolean,
    default: false,
  },
  color: {
    type: String,
    default: '#3B82F6', // Default blue color
  },
  icon: {
    type: String,
    default: null,
  },
  iconType: {
    type: String,
    enum: ['fontawesome'],
    default: 'fontawesome',
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

// Compound index to prevent duplicate category names per user
CategorySchema.index({ name: 1, userId: 1, type: 1 }, { unique: true });

// Update the updatedAt field before saving
CategorySchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.models.Category || mongoose.model('Category', CategorySchema);