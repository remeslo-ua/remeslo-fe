import mongoose from 'mongoose';

export interface IHookahHistory extends mongoose.Document {
  userId: mongoose.Types.ObjectId;
  suggestionId: mongoose.Types.ObjectId;
  createdAt: Date;
}

const HookahHistorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  suggestionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'HookahSuggestion',
    required: true,
  },
}, {
  timestamps: true,
});

// Index for faster queries by user
HookahHistorySchema.index({ userId: 1, createdAt: -1 });

export default mongoose.models.HookahHistory || mongoose.model<IHookahHistory>('HookahHistory', HookahHistorySchema);
