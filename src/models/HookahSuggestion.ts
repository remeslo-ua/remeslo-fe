import mongoose from 'mongoose';

export interface IHookahSuggestion extends mongoose.Document {
  preferencesHash: string;
  preferences: {
    name?: string;
    tastes: string[];
    zodiacSign?: string;
    moods: string[];
    intensity?: string;
    occasion?: string;
  };
  suggestions: Array<{
    name: string;
    ingredients: string[];
    reasoning: string;
  }>;
  analysis: string;
  createdAt: Date;
  updatedAt: Date;
}

const HookahSuggestionSchema = new mongoose.Schema({
  preferencesHash: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  preferences: {
    name: String,
    tastes: [String],
    zodiacSign: String,
    moods: [String],
    intensity: String,
    occasion: String,
  },
  suggestions: [{
    name: {
      type: String,
      required: true,
    },
    ingredients: [String],
    reasoning: {
      type: String,
      required: true,
    },
  }],
  analysis: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
});

export default mongoose.models.HookahSuggestion || mongoose.model<IHookahSuggestion>('HookahSuggestion', HookahSuggestionSchema);
